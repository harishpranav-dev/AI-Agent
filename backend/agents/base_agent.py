"""
module: base_agent.py
purpose: Base class that all agents (Planner, Researcher, Writer) inherit.
         Handles the core loop: call Claude → handle tool use → return result.
author: HP & Mushan
"""

import os
import json
import logging
from typing import Callable, Optional
from anthropic import AsyncAnthropic

logger = logging.getLogger(__name__)


class BaseAgent:
    """
    Base class for all AI agents in AutoAgent Studio.

    Every agent follows the same pattern:
    1. Receive input
    2. Call Claude API with a system prompt and optional tools
    3. If Claude wants to use a tool, execute it and continue
    4. Return the final text response

    Subclasses set their own system_prompt and tools.
    """

    def __init__(
        self,
        name: str,
        system_prompt: str,
        tools: Optional[list] = None,
        model: str = "claude-sonnet-4-20250514"
    ):
        """
        Initialize a new agent.

        Args:
            name: Human-readable name like 'Planner', 'Researcher'.
            system_prompt: Instructions that define this agent's behavior.
            tools: List of tool definitions this agent can use (Claude format).
            model: Which Claude model to use.
        """
        self.name = name
        self.system_prompt = system_prompt
        self.tools = tools or []
        self.model = model
        self.client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))

    async def run(
        self,
        user_message: str,
        tool_executor: Optional[Callable] = None,
        event_callback: Optional[Callable] = None
    ) -> str:
        """
        Run this agent on a user message.

        This is the core agentic loop:
        - Send message to Claude
        - If Claude wants to use a tool, call tool_executor and send result back
        - Keep looping until Claude gives a final text response

        Args:
            user_message: The input prompt for this agent.
            tool_executor: Async function that executes tools by name.
                           Signature: async (name: str, input: dict) -> str
            event_callback: Optional async function to emit progress events.
                           Signature: async (event_type: str, data: dict) -> None

        Returns:
            Claude's final text response as a string.
        """
        messages = [{"role": "user", "content": user_message}]
        tools_called_count = 0

        # Maximum tool-use iterations to prevent infinite loops
        max_iterations = 10

        for iteration in range(max_iterations):
            try:
                # Build API call kwargs
                api_kwargs = {
                    "model": self.model,
                    "max_tokens": 4096,
                    "system": self.system_prompt,
                    "messages": messages
                }

                # Only include tools if this agent has them
                if self.tools:
                    api_kwargs["tools"] = self.tools

                response = await self.client.messages.create(**api_kwargs)

            except Exception as e:
                logger.error(f"[{self.name}] Claude API call failed: {e}")
                raise

            # Check if Claude wants to use a tool
            if response.stop_reason == "tool_use":
                # Find the tool_use block in the response
                tool_use_block = None
                text_content = ""

                for block in response.content:
                    if block.type == "tool_use":
                        tool_use_block = block
                    elif block.type == "text":
                        text_content = block.text

                if tool_use_block and tool_executor:
                    tool_name = tool_use_block.name
                    tool_input = tool_use_block.input

                    logger.info(f"[{self.name}] Calling tool: {tool_name}")

                    # Emit tool call event if callback provided
                    if event_callback:
                        await event_callback(
                            f"{self.name.lower()}_tool_call",
                            {"tool": tool_name, "input": tool_input}
                        )

                    # Execute the tool
                    tool_result = await tool_executor(tool_name, tool_input)
                    tools_called_count += 1

                    # Add Claude's response and tool result to conversation
                    messages.append({"role": "assistant", "content": response.content})
                    messages.append({
                        "role": "user",
                        "content": [{
                            "type": "tool_result",
                            "tool_use_id": tool_use_block.id,
                            "content": tool_result
                        }]
                    })

                    # Continue the loop — Claude will process the tool result
                    continue
                else:
                    logger.warning(f"[{self.name}] Tool use requested but no executor available")
                    break

            # Claude gave a final response (stop_reason == "end_turn")
            final_text = ""
            for block in response.content:
                if block.type == "text":
                    final_text += block.text

            logger.info(
                f"[{self.name}] Completed — {tools_called_count} tool(s) called, "
                f"{len(final_text)} chars output"
            )
            return final_text

        # If we exhausted iterations, return whatever we have
        logger.warning(f"[{self.name}] Hit max iterations ({max_iterations})")
        return "Agent reached maximum tool-use iterations. Partial result may be incomplete."
