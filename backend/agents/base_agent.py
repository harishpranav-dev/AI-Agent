"""
module: base_agent.py
purpose: Base class that all AutoAgent Studio agents inherit from.
         Handles Claude API communication, tool execution loop, and logging.
author: HP & Mushan
"""

import anthropic
import os
import logging
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class BaseAgent:
    """
    Base agent class. All agents (Planner, Researcher, Writer) inherit this.
    Handles the core Claude API loop including tool use.
    
    Think of this like a 'template employee' — it knows how to communicate
    with Claude (the brain), but doesn't have a specific job yet.
    Subclasses give it a job by overriding run().
    """

    def __init__(
        self,
        name: str,
        system_prompt: str,
        tools: Optional[list] = None,
        model: str = "claude-sonnet-4-20250514"
    ):
        """
        Initialize the base agent.

        Args:
            name: Agent display name (e.g. "Planner Agent")
            system_prompt: Instructions that define the agent's role
            tools: List of tool definitions this agent can use
            model: Claude model to use
        """
        self.name = name
        self.system_prompt = system_prompt
        self.tools = tools or []
        self.model = model
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        logger.info(f"Agent initialized: {self.name}")

    async def call_claude(self, messages: list, max_tokens: int = 2000) -> str:
        """
        Make a call to Claude API. Handles tool use loop automatically.

        How it works:
        1. Sends your messages + system prompt to Claude
        2. If Claude wants to use a tool, it executes the tool and continues
        3. Keeps looping until Claude gives a final text response

        Args:
            messages: List of message dicts with role and content
            max_tokens: Maximum tokens in response

        Returns:
            Final text response from Claude
        """
        logger.info(f"{self.name}: Calling Claude API")

        kwargs = {
            "model": self.model,
            "max_tokens": max_tokens,
            "system": self.system_prompt,
            "messages": messages
        }

        if self.tools:
            kwargs["tools"] = self.tools

        try:
            response = self.client.messages.create(**kwargs)

            # Tool use loop: if Claude wants to call a tool, execute it
            # and send the result back, repeating until Claude gives text
            while response.stop_reason == "tool_use":
                tool_block = next(
                    b for b in response.content if b.type == "tool_use"
                )

                logger.info(
                    f"{self.name}: Using tool '{tool_block.name}' "
                    f"with input: {tool_block.input}"
                )

                tool_result = await self.execute_tool(
                    tool_block.name, tool_block.input
                )

                # Append assistant response + tool result to messages
                messages = messages + [
                    {"role": "assistant", "content": response.content},
                    {
                        "role": "user",
                        "content": [{
                            "type": "tool_result",
                            "tool_use_id": tool_block.id,
                            "content": str(tool_result)
                        }]
                    }
                ]

                response = self.client.messages.create(
                    **kwargs | {"messages": messages}
                )

            # Extract final text from response
            final_text = next(
                (b.text for b in response.content if hasattr(b, "text")),
                ""
            )
            logger.info(f"{self.name}: Completed successfully")
            return final_text

        except anthropic.APIError as e:
            logger.error(f"{self.name}: Claude API error: {e}")
            raise
        except Exception as e:
            logger.error(f"{self.name}: Unexpected error: {e}", exc_info=True)
            raise

    async def execute_tool(self, tool_name: str, tool_input: dict) -> str:
        """
        Override this in subclasses to handle specific tools.
        Base version returns a 'not implemented' message.

        Args:
            tool_name: Name of the tool to execute
            tool_input: Input parameters for the tool

        Returns:
            Tool result as string
        """
        return f"Tool '{tool_name}' not implemented in {self.name}"

    async def run(self, input_data: dict) -> dict:
        """
        Main entry point for running the agent.
        Every subclass MUST override this with its own logic.

        Args:
            input_data: Dict containing agent inputs

        Returns:
            Dict containing agent outputs
        """
        raise NotImplementedError(f"{self.name} must implement run()")