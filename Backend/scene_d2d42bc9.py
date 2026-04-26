from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # --- 1. Introduction ---
        title = Text("How Does Gradient Descent Work?", font_size=50).to_edge(UP)
        goal_text = Text(
            "Our goal: Find the minimum of a function.",
            font_size=30
        ).next_to(title, DOWN, buff=0.8)

        self.play(Create(title), run_time=1.5)
        self.wait(0.5)
        self.play(Write(goal_text))
        self.wait(2)
        self.play(FadeOut(title, goal_text))

        # --- 2. The Cost Function ---
        # Define the function: f(x) = 0.5 * (x - 2)^2 + 1
        # This is a parabola with minimum at x=2, y=1
        def func(x):
            return 0.5 * (x - 2)**2 + 1

        # Derivative for gradient: f'(x) = x - 2
        def derivative_func(x):
            return x - 2

        axes = Axes(
            x_range=[-1, 5, 1],
            y_range=[0, 8, 1],
            x_length=7,
            y_length=5,
            axis_config={"color": BLUE}
        ).add_coordinates().shift(LEFT * 0.5) # Shift left to make space for text
        
        axes_label_x = axes.get_x_axis_label(MathTex("x \\text{ (Parameter)}"))
        axes_label_y = axes.get_y_axis_label(MathTex("f(x) \\text{ (Cost)}")).set_rotation(PI/2)
        
        graph = axes.plot(func, color=GREEN)
        graph_label = MathTex("f(x) = \\frac{1}{2}(x-2)^2 + 1", font_size=30).next_to(graph, UP, buff=0.5).set_color(GREEN)
        
        graph_title = Text("The Cost Function", font_size=40).to_edge(UP)

        self.play(
            Create(graph_title),
            Create(axes),
            Write(axes_label_x),
            Write(axes_label_y),
            run_time=2
        )
        self.wait(0.5)
        self.play(Create(graph), Write(graph_label))
        self.wait(2)

        # --- 3. The Starting Point ---
        initial_x = -0.5 # Our initial guess for x
        initial_point = Dot(axes.c2p(initial_x, func(initial_x)), color=RED)
        initial_point_label = MathTex("x_0", font_size=30).next_to(initial_point, UP + RIGHT, buff=0.1).set_color(RED).set_z_index(1)
        
        start_text = Text("Let's start with an initial guess, x₀.", font_size=30).next_to(graph_title, DOWN, buff=0.5)

        self.play(Write(start_text))
        self.play(Create(initial_point))
        self.play(Write(initial_point_label))
        self.wait(2)
        self.play(FadeOut(start_text))

        # --- 4. The Gradient (Concept) ---
        gradient_concept_title = Text("The Gradient: Direction of Steepest Ascent", font_size=40).to_edge(UP)
        gradient_concept_text = Text(
            "The gradient tells us the slope and direction of steepest ascent.",
            font_size=28
        ).next_to(gradient_concept_title, DOWN, buff=0.5)
        
        # Function to generate a tangent line at a given x_val
        def get_tangent_line(x_val, color=YELLOW):
            slope = derivative_func(x_val)
            
            # Convert slope from mathematical units to Manim's screen units for angle
            # dx (x-axis unit size) and dy (y-axis unit size) from axes determine visual slope
            manim_slope = slope * (axes.get_y_axis().get_unit_size() / axes.get_x_axis().get_unit_size())
            
            # Angle of the tangent line
            tangent_angle = np.arctan(manim_slope)
            
            # Create a line segment centered at the point on the graph
            tangent = Line(ORIGIN, RIGHT * 2, color=color, stroke_width=3).rotate(tangent_angle)
            tangent.move_to(axes.c2p(x_val, func(x_val)))
            return tangent

        current_tangent = get_tangent_line(initial_x)
        
        # Calculate arrow for the gradient (steepest ascent)
        slope_at_initial_x = derivative_func(initial_x)
        manim_slope_at_initial_x = slope_at_initial_x * (axes.get_y_axis().get_unit_size() / axes.get_x_axis().get_unit_size())
        
        gradient_angle = np.arctan(manim_slope_at_initial_x)
        # Gradient points in the direction of steepest ascent.
        # If slope is positive, gradient points up-right. If slope is negative, gradient points up-left.
        # So we need to ensure the x component follows the sign of the slope (horizontal direction)
        # And y component is always positive for "ascent" in 2D cost function visualization
        
        # For a 1D function plotted as f(x) vs x, the gradient vector is (dx, dy)
        # The direction vector on the graph is (sign(dx), sign(dy)). For ascent, dy is always positive.
        # The x-component of the gradient arrow should be proportional to dx and y-component to dy.
        # A simpler way: The gradient points "up" the tangent line.
        # tangent_unit_vector = np.array([np.cos(gradient_angle), np.sin(gradient_angle), 0])
        # The gradient points *along* the tangent line, in the direction of increasing f(x).
        # So, if derivative is positive, x increases. If derivative is negative, x decreases.
        
        # For a 1D function f(x), the gradient is just f'(x).
        # On the graph, the direction of steepest ascent is 'up' the tangent.
        # The vector representing this on the (x, f(x)) plane is proportional to (1, f'(x)).
        # Normalized vector: (1 / sqrt(1 + f'(x)^2), f'(x) / sqrt(1 + f'(x)^2))
        
        # Let's visualize the gradient as an arrow pointing along the tangent upwards.
        # The vector direction on the plot should be related to the slope.
        # The "arrow" representing gradient should point in the direction of increasing f(x) along the curve's tangent.
        # So, if derivative is positive, arrow points right and up. If negative, left and up.
        # The visual slope in Manim is `manim_slope`.
        
        gradient_vector_unnormalized = np.array([1, manim_slope_at_initial_x, 0])
        gradient_vector_direction = gradient_vector_unnormalized / np.linalg.norm(gradient_vector_unnormalized)
        
        gradient_arrow = Arrow(
            start=initial_point.get_center(), 
            end=initial_point.get_center() + gradient_vector_direction * 0.8, # Consistent visual length
            buff=0, 
            color=ORANGE
        )
        gradient_label = MathTex("\\nabla f(x_0)", font_size=30).next_to(gradient_arrow, UP, buff=0.1).set_color(ORANGE).set_z_index(1)

        self.play(
            Transform(graph_title, gradient_concept_title),
            Write(gradient_concept_text),
            run_time=1
        )
        self.play(Create(current_tangent))
        self.play(Create(gradient_arrow), Write(gradient_label))
        self.wait(2)

        # --- 5. Moving Downhill (Negative Gradient) ---
        negative_gradient_title = Text("Move Downhill: Opposite of the Gradient", font_size=40).to_edge(UP)
        negative_gradient_text = Text(
            "To minimize the cost, we move in the direction opposite to the gradient.",
            font_size=28
        ).next_to(negative_gradient_title, DOWN, buff=0.5)

        # Reverse gradient arrow
        negative_gradient_arrow = Arrow(
            start=initial_point.get_center(), 
            end=initial_point.get_center() - gradient_vector_direction * 0.8, # Opposite direction
            buff=0, 
            color=PURPLE
        )
        negative_gradient_label = MathTex("-\\nabla f(x_0)", font_size=30).next_to(negative_gradient_arrow, DOWN, buff=0.1).set_color(PURPLE).set_z_index(1)

        self.play(
            Transform(graph_title, negative_gradient_title),
            Transform(gradient_concept_text, negative_gradient_text),
            FadeOut(gradient_arrow, gradient_label)
        )
        self.play(Create(negative_gradient_arrow), Write(negative_gradient_label))
        self.wait(2)

        # --- 6. Taking a Step (Learning Rate) ---
        learning_rate_title = Text("Take a Step: The Learning Rate (α)", font_size=40).to_edge(UP)
        learning_rate_text = Text(
            "We take a small step, whose size is determined by the learning rate (α).",
            font_size=28
        ).next_to(learning_rate_title, DOWN, buff=0.5)
        
        update_rule_math = MathTex(
            "x_{new} = x_{old} - \\alpha \\cdot \\nabla f(x_{old})",
            font_size=40
        ).next_to(axes, DOWN, buff=0.8)

        self.play(
            Transform(graph_title, learning_rate_title),
            Transform(gradient_concept_text, learning_rate_text),
            FadeOut(current_tangent, negative_gradient_arrow, negative_gradient_label)
        )
        self.play(Write(update_rule_math))
        self.wait(1)

        # --- 7. Iteration: The Descent ---
        descent_title = Text("Repeat: Iterative Descent", font_size=40).to_edge(UP)
        descent_text = Text(
            "We repeat this process, iteratively moving closer to the minimum.",
            font_size=28
        ).next_to(descent_title, DOWN, buff=0.5)
        
        self.play(
            Transform(graph_title, descent_title),
            Transform(gradient_concept_text, descent_text)
        )
        self.wait(1)

        # --- Prepare for animated descent ---
        self.play(FadeOut(initial_point_label)) 

        # Define a list to store previous points for path drawing
        path_points_coords = [axes.c2p(initial_x, func(initial_x))]
        path = VMobject(stroke_color=YELLOW, stroke_width=4)
        path.set_points_as_corners(path_points_coords)

        current_x = initial_x
        learning_rate = 0.3
        iterations = 8

        moving_dot = Dot(axes.c2p(current_x, func(current_x)), color=RED)
        current_x_label = MathTex("x_k", font_size=30).next_to(moving_dot, UP + RIGHT, buff=0.1).set_color(RED).set_z_index(1)

        self.remove(initial_point) # Remove the static initial_point
        self.add(moving_dot, current_x_label, path) # Add moving dot, label, and empty path to scene

        # Fix: Use ReplacementTransform for dynamic math text to avoid zip error
        # Initialize with an empty MathTex. In the loop, it will be replaced by new content.
        current_step_math_on_scene = MathTex("", font_size=28).next_to(update_rule_math, DOWN, buff=0.5).set_z_index(1)
        self.add(current_step_math_on_scene)

        for i in range(iterations):
            x_old = current_x
            
            # Calculate gradient (derivative)
            gradient = derivative_func(x_old)
            
            # Update x
            x_new = x_old - learning_rate * gradient
            
            # Ensure x_new doesn't go too far past minimum to avoid very tiny arrows
            if abs(x_new - 2) < 0.1 and abs(x_old - 2) < 0.1 and i > 2:
                x_new = 2.0 # Force convergence to minimum visually
                gradient = 0.0
            
            # Manim objects for current iteration
            point_on_graph = axes.c2p(x_old, func(x_old))
            
            # Tangent line
            tangent_line = get_tangent_line(x_old, color=YELLOW)

            # Descent arrow (negative gradient direction)
            slope_at_point = derivative_func(x_old)
            manim_slope_at_point = slope_at_point * (axes.get_y_axis().get_unit_size() / axes.get_x_axis().get_unit_size())
            
            # Calculate the direction for the descent arrow
            # Negative gradient points 'down' the tangent line.
            # If derivative is positive, x decreases (left and down). If negative, x increases (right and down).
            
            # The vector on the graph that represents the gradient is proportional to (1, f'(x)).
            # The negative gradient is proportional to (-1, -f'(x)).
            # Or simpler, the vector for descent is -1 times the ascent vector (gradient_vector_direction).
            
            gradient_vector_unnormalized_for_arrow = np.array([1, manim_slope_at_point, 0])
            gradient_vector_direction_for_arrow = gradient_vector_unnormalized_for_arrow / np.linalg.norm(gradient_vector_unnormalized_for_arrow)
            
            visual_arrow_length = 0.8
            if abs(gradient) < 0.1: # Make arrow shorter when near minimum
                visual_arrow_length = 0.3
            
            descent_arrow = Arrow(
                start=point_on_graph,
                end=point_on_graph - gradient_vector_direction_for_arrow * visual_arrow_length, # Opposite direction
                buff=0,
                color=PURPLE,
                max_stroke_width_to_length_ratio=4,
                max_tip_length_to_length_ratio=0.3
            )
            
            # Math for current step
            new_step_math_to_display = MathTex(
                f"x_{i} = {x_old:.2f}",
                "\\quad \\nabla f(x_{i}) = {gradient:.2f}",
                f"\\quad x_{{{i+1}}} = {x_old:.2f} - {learning_rate:.2f} \\cdot {gradient:.2f} = {x_new:.2f}",
                font_size=28
            ).next_to(update_rule_math, DOWN, buff=0.5).set_z_index(1)

            self.play(
                Create(tangent_line),
                Create(descent_arrow),
                ReplacementTransform(current_step_math_on_scene, new_step_math_to_display), # Fix: Use ReplacementTransform
                run_time=1
            )
            # Crucially, update the reference to the *new* Mobject that is now on the scene
            current_step_math_on_scene = new_step_math_to_display
            
            # Add new point to path
            path_points_coords.append(axes.c2p(x_new, func(x_new)))
            
            self.play(
                moving_dot.animate.move_to(axes.c2p(x_new, func(x_new))),
                current_x_label.animate.next_to(axes.c2p(x_new, func(x_new)), UP + RIGHT, buff=0.1),
                path.animate.set_points_as_corners(path_points_coords), # Animate path growth
                FadeOut(tangent_line, descent_arrow),
                run_time=1
            )
            
            current_x = x_new
            self.wait(0.2)
        
        # --- 8. Convergence ---
        convergence_title = Text("Convergence: Reaching the Minimum", font_size=40).to_edge(UP)
        convergence_text = Text(
            "As we approach the minimum, the gradient approaches zero, and our steps become tiny.",
            font_size=28
        ).next_to(convergence_title, DOWN, buff=0.5)

        self.play(
            Transform(graph_title, convergence_title),
            Transform(gradient_concept_text, convergence_text),
            FadeOut(update_rule_math, current_step_math_on_scene) # Use the updated variable
        )
        
        # Show the actual minimum
        minimum_point = Dot(axes.c2p(2, 1), color=BLUE)
        minimum_label = MathTex("x_{min}", font_size=30).next_to(minimum_point, UP + RIGHT, buff=0.1).set_color(BLUE).set_z_index(1)

        self.play(FadeIn(minimum_point, minimum_label))
        self.play(
            moving_dot.animate.move_to(axes.c2p(2, 1)),
            current_x_label.animate.next_to(axes.c2p(2, 1), UP + RIGHT, buff=0.1)
        )
        self.wait(2)

        # --- 9. Summary ---
        self.play(FadeOut(
            axes, axes_label_x, axes_label_y, graph, graph_label,
            moving_dot, current_x_label, path,
            minimum_point, minimum_label,
            graph_title, gradient_concept_text # Fade out existing text as well
        ))

        summary_title = Text("Gradient Descent: Summary", font_size=50).to_edge(UP)
        summary_points = BulletedList(
            "1. Start with an initial guess.",
            "2. Calculate the gradient (steepness and direction).",
            "3. Move in the opposite direction of the gradient.",
            "4. Step size determined by the learning rate (α).",
            "5. Repeat until convergence (gradient ≈ 0).",
            font_size=32
        ).next_to(summary_title, DOWN, buff=0.8).set_color(BLUE)
        summary_points.arrange(DOWN, aligned_edge=LEFT, buff=0.5)

        self.play(Create(summary_title)) # Use Create for the first time it appears
        self.play(Create(summary_points))
        self.wait(4)

        final_message = Text("And that's how Gradient Descent finds the minimum!", font_size=40).to_edge(DOWN)
        self.play(Write(final_message))
        self.wait(3)
        self.play(FadeOut(*self.mobjects))