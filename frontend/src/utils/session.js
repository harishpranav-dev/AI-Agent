/**
 * module: session.js
 * purpose: Single source of truth for the browser session ID.
 *          Used by useAgent (to tag tasks in MongoDB) and by
 *          History page (to fetch tasks back). Both MUST use
 *          the same ID or history will appear empty.
 * author: HP & Mushan
 */

let _sessionId = null;

/**
 * Returns a persistent session ID for this browser tab/session.
 * Creates one on first call, then reuses it for the lifetime of the page.
 * Also stores in localStorage so it survives page refreshes.
 */
export function getSessionId() {
  if (_sessionId) return _sessionId;

  // Check localStorage first (survives refresh)
  _sessionId = localStorage.getItem("autoagent_session_id");

  if (!_sessionId) {
    // Generate a new one if none exists
    _sessionId = crypto.randomUUID();
    localStorage.setItem("autoagent_session_id", _sessionId);
  }

  return _sessionId;
}
