
# Math7 / Heart Summary Specification v1

## What is math7?

"Math7" is a "Seven-Principles" summary derived from the primary voice path of a word's analysis. It provides a higher-level, symbolic interpretation of the core engine's output, focusing on the sequence and nature of the principles involved.

## JSON Shape

The `math7` object will be attached to the main `AnalyzeWordResult` and will have the following structure:

```json
{
  "math7": {
    "primary": {
      "voicePath": "string",
      "levelPath": "string",
      "ringPath": "string",
      "state": "'flow' | 'cycle'",
      "totalSteps": "number",
      "totalMod7": "number",
      "principlesPath": "string[]"
    }
  }
}
```

### Field Descriptions

-   **`voicePath`**: The primary voice path, e.g., `"U → I"`.
-   **`levelPath`**: The corresponding level path, e.g., `"Low → High"`.
-   **`ringPath`**: The corresponding ring path, e.g., `"1 → 1"`.
-   **`state`**: Describes the path's nature.
    -   `"flow"`: The first and last vowels are different.
    -   `"cycle"`: The first and last vowels are the same.
-   **`totalSteps`**: The number of vowels in the path.
-   **`totalMod7`**: `totalSteps % 7`. A result of `0` is represented as `7`.
-   **`principlesPath`**: An array of principle names corresponding to the `voicePath`.

## Principle Mapping

Each vowel in the Seven-Voices model maps to a core principle:

| Vowel | Principle           |
| :---- | :------------------ |
| **A** | Truth / Source / Action |
| **E** | Expansion           |
| **I** | Insight             |
| **O** | Balance             |
| **U** | Unity               |
| **Y** | Network Integrity   |
| **Ë** | Evolution           |

## Examples

### 1. `study`

-   **Voice Path**: `U → I` (Unity → Insight)
-   **Reading**: A state of **Unity** seeks **Insight**. The path is a "flow" from one principle to another.
-   **JSON (conceptual)**:
    ```json
    "primary": {
      "voicePath": "U → I",
      "levelPath": "Low → High",
      "ringPath": "1 → 1",
      "state": "flow",
      "totalSteps": 2,
      "totalMod7": 2,
      "principlesPath": ["Unity", "Insight"]
    }
    ```

### 2. `damage`

-   **Voice Path**: `A → E` (Truth → Expansion)
-   **Reading**: An initial **Action** or **Truth** leads to **Expansion**. This is also a "flow."
-   **JSON (conceptual)**:
    ```json
    "primary": {
      "voicePath": "A → E",
      "levelPath": "High → High",
      "ringPath": "3 → 2",
      "state": "flow",
      "totalSteps": 2,
      "totalMod7": 2,
      "principlesPath": ["Truth", "Expansion"]
    }
    ```

### 3. `love`

-   **Voice Path**: `O → E` (Balance → Expansion)
-   **Reading**: A state of **Balance** moves toward **Expansion**.
-   **JSON (conceptual)**:
    ```json
    "primary": {
      "voicePath": "O → E",
      "levelPath": "Mid → High",
      "ringPath": "0 → 2",
      "state": "flow",
      "totalSteps": 2,
      "totalMod7": 2,
      "principlesPath": ["Balance", "Expansion"]
    }
    ```
