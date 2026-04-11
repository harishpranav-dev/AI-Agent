"""
module: test_agent.py
purpose: Simple test agent to verify Claude API connection works.
         Delete this file after Phase 2 is verified.
author: HP & Mushan
"""

from agents.base_agent import BaseAgent


class TestAgent(BaseAgent):
    """Simple test agent that answers questions."""

    def __init__(self):
        super().__init__(
            name="Test Agent",
            system_prompt="You are a helpful assistant. Answer questions concisely in 2-3 sentences."
        )

    async def run(self, input_data: dict) -> dict:
        """
        Run the test agent with a simple question.

        Args:
            input_data: Dict with a "question" key

        Returns:
            Dict with agent name, question, answer, and success flag
        """
        question = input_data.get("question", "What is an AI agent?")

        messages = [{"role": "user", "content": question}]
        response = await self.call_claude(messages)

        return {
            "agent": self.name,
            "question": question,
            "answer": response,
            "success": True
        }