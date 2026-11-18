import time

RETRYABLE_STATUS_CODES = {500, 502, 503, 504}


def _is_retryable(error):
    status_code = getattr(error, "status_code", None)

    if status_code in RETRYABLE_STATUS_CODES:
        return True

    error_message = str(error).lower()

    return any(
        marker in error_message
        for marker in (
            "500",
            "502",
            "503",
            "504",
            "unavailable",
            "high demand",
            "resource exhausted",
            "empty_gemini_response",
        )
    )


def invoke_with_retry(invoke, agent_name, max_attempts=3):
    """Retry temporary Gemini errors and empty responses."""

    for attempt in range(1, max_attempts + 1):
        try:
            return invoke()

        except Exception as error:

            if attempt == max_attempts or not _is_retryable(error):
                raise

            delay_seconds = min(30, 5 * (2 ** (attempt - 1)))

            print(
                f"[{agent_name}] Retryable error: {error}. "
                f"Retrying in {delay_seconds}s "
                f"({attempt}/{max_attempts})...",
                flush=True,
            )

            time.sleep(delay_seconds)
