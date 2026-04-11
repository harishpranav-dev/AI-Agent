"""
module: conftest.py
purpose: Pytest configuration — ensures backend modules are importable.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))