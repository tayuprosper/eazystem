from Backend.config import groq_client
SYSTEM_PROMPT = """
You are an expert Manim CE developer creating clean, professional 3Blue1Brown-style math animations.

# STRICT FRAME SAFETY RULES (MUST FOLLOW)
- All objects and text MUST stay fully inside the visible frame.
- Safe area: Use .to_edge(UP, buff=0.6), .to_edge(DOWN, buff=0.8), .shift(LEFT*3.5), .shift(RIGHT*3.5)
- Never use .to_corner() or .move_to() without safe buffers.
- Title: .to_edge(UP, buff=0.5), font_size=42-48
- Main text: font_size=32-36 maximum
- Always leave generous padding (buff=0.4 or more)
- Never put too many elements on screen at once (max 2-3 major items)
- Use self.play(FadeOut(*self.mobjects)) before switching sections
- Keep animations calm and well-spaced

# OUTPUT RULES
- Return ONLY clean Python code. No explanations, no markdown.
- Start directly with: from manim import *
- Main class: class GeneratedScene(Scene):
"""

def generate_manim_code(prompt: str, broken_code: str = None, error_msg: str = None) -> str:
    if broken_code and error_msg:
        user_content = f"""
Create a clean educational Manim animation for this topic:

{prompt}

Requirements:
- Keep EVERYTHING fully inside the video frame with safe padding.
- No text or objects should go off-screen.
- Use large, readable text with proper spacing.
- Structure: Hook (title) → Visual intuition → Step-by-step → Example → Conclusion.
- Clear the screen between major sections using FadeOut(*self.mobjects).

Return only the complete Python code.
"""
    else:
        user_content = f"""
Create a clean, professional Manim animation for this topic:

{prompt}

Requirements:
- Keep every text and object fully inside the video frame.
- Prevent any text overlapping.
- Use clear spacing and .to_edge() / .shift() for positioning.
- Use self.play(FadeOut(*self.mobjects)) when changing scenes.
- Make text large and readable.
- Follow Hook → Intuition → Mechanics → Example → Conclusion structure.
- Name the class GeneratedScene
Return only the complete Python code.
"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content}
            ],
            temperature=0.7,
            max_tokens=4000,
        )

        raw_code = response.choices[0].message.content.strip()

        # === Improved Code Cleaning ===
        code = raw_code

        # Remove common markdown wrappers
        if "```python" in code:
            code = code.split("```python", 1)[1].split("```", 1)[0]
        elif "```" in code:
            code = code.split("```", 1)[1].split("```", 1)[0]

        # Final cleanup
        code = code.strip()

        # Safety: Ensure it starts with import
        if not code.startswith("from manim"):
            # If model ignored instructions, try to extract code block
            lines = code.splitlines()
            for i, line in enumerate(lines):
                if "from manim" in line:
                    code = "\n".join(lines[i:])
                    break

        if not code or len(code) < 50:
            raise ValueError("Generated code is empty or too short")

        return code

    except Exception as e:
        print(f"Error generating code: {e}")
        # Fallback basic template
        return f"""from manim import *

class GeneratedScene(Scene):
    def construct(self):
        title = Text("{prompt[:50]}...", font_size=48)
        self.play(Write(title))
        self.wait(2)
"""
