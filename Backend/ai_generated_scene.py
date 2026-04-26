from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # --- Helper Functions ---
        def create_state(name, is_final=False, position=ORIGIN):
            """Creates a graphical representation of an NFA/DFA state."""
            circle = Circle(radius=0.5, color=WHITE)
            if is_final:
                inner_circle = Circle(radius=0.4, color=WHITE)
                state_obj = VGroup(circle, inner_circle)
            else:
                state_obj = circle
            label = MathTex(name, color=WHITE)
            return VGroup(state_obj, label).move_to(position)

        def create_transition(start_state_obj, end_state_obj, label_text, curve=0):
            """Creates an arrow transition between states with a label."""
            if start_state_obj == end_state_obj: # Self-loop transition
                # Calculate points for a top-right self-loop
                start_point = start_state_obj.get_center() + UP * 0.5 + RIGHT * 0.2
                end_point = start_state_obj.get_center() + UP * 0.2 + RIGHT * 0.5
                
                arrow = ArcBetweenPoints(
                    start_point,
                    end_point,
                    angle=-PI/2 # A 90-degree curve
                )
                arrow.add_tip(tip_length=0.15)
                label = MathTex(label_text).next_to(arrow, UP * 0.5) # Position label above the curve
            else:
                # Calculate start/end points to avoid arrow tip collision
                start_point = start_state_obj.get_center()
                end_point = end_state_obj.get_center()
                
                if curve == 0:
                    arrow = Arrow(start_point, end_point, buff=0.6, stroke_width=3, max_tip_length_to_length_ratio=0.15)
                    label = MathTex(label_text).next_to(arrow, UP * 0.25)
                else: # Curved arrow
                    # Determine appropriate points for curved arrows
                    if curve > 0: # Curve upwards
                        start_conn = start_state_obj.get_right() + UP*0.1
                        end_conn = end_state_obj.get_left() + UP*0.1
                        label_pos_direction = UP
                    else: # Curve downwards
                        start_conn = start_state_obj.get_right() + DOWN*0.1
                        end_conn = end_state_obj.get_left() + DOWN*0.1
                        label_pos_direction = DOWN

                    # Adjust start/end connections based on angle to avoid overlapping straight lines
                    if curve > 0:
                        start_conn = start_state_obj.get_critical_point(UR + RIGHT*0.1)
                        end_conn = end_state_obj.get_critical_point(UL + LEFT*0.1)
                    else:
                        start_conn = start_state_obj.get_critical_point(DR + RIGHT*0.1)
                        end_conn = end_state_obj.get_critical_point(DL + LEFT*0.1)
                        
                    arrow = ArcBetweenPoints(start_conn, end_conn, angle=curve * DEGREES)
                    arrow.add_tip(tip_length=0.15)
                    label = MathTex(label_text).next_to(arrow.get_center(), label_pos_direction * 0.5)
            
            return VGroup(arrow, label)

        # --- Scene 1: Introduction ---
        title = Title("NFA to DFA Conversion: The Power Set Construction").to_edge(UP)
        self.play(Write(title))
        
        intro_text1 = Tex("Non-deterministic Finite Automata (NFA) offer flexibility.").next_to(title, DOWN, buff=1)
        intro_text2 = Tex("Deterministic Finite Automata (DFA) are unambiguous and efficient.").next_to(intro_text1, DOWN, buff=0.5)
        intro_text3 = Tex("Every NFA has an equivalent DFA!").next_to(intro_text2, DOWN, buff=0.7).set_color(GREEN) # FIX: Changed GREEN_SCREEN to GREEN
        
        self.play(Create(intro_text1))
        self.wait(1)
        self.play(Create(intro_text2))
        self.wait(1)
        self.play(Create(intro_text3))
        self.wait(2)
        
        self.play(FadeOut(VGroup(title, intro_text1, intro_text2, intro_text3)))

        # --- Scene 2: Our NFA Example ---
        nfa_title = Title("Our NFA Example").to_edge(UP)
        self.play(Write(nfa_title))

        # NFA states (q0 and q1 for simplicity)
        q0_obj = create_state("q_0", is_final=False, position=LEFT*2)
        q1_obj = create_state("q_1", is_final=True, position=RIGHT*2)
        
        nfa_states_group = VGroup(q0_obj, q1_obj)
        self.play(Create(nfa_states_group))

        # NFA initial pointer
        initial_arrow_nfa = Arrow(start=LEFT*3.5, end=q0_obj[0].get_left(), buff=0.1, stroke_width=3, max_tip_length_to_length_ratio=0.15)
        self.play(Create(initial_arrow_nfa))
        
        # NFA transitions
        # From q0
        trans_q0_a = create_transition(q0_obj[0], q0_obj[0], "a")
        trans_q0_b = create_transition(q0_obj[0], q1_obj[0], "b", curve=20) # Curved upwards
        # From q1
        trans_q1_epsilon = create_transition(q1_obj[0], q0_obj[0], r"\epsilon", curve=-20) # Curved downwards
        trans_q1_a = create_transition(q1_obj[0], q1_obj[0], "a")

        nfa_transitions_group = VGroup(trans_q0_a, trans_q0_b, trans_q1_epsilon, trans_q1_a)
        self.play(Create(nfa_transitions_group))

        nfa_details = VGroup(
            Tex("States: {$q_0, q_1$}"),
            Tex("Alphabet: {a, b}"),
            Tex("Start State: $q_0$"),
            Tex("Final State: $q_1$")
        ).arrange(DOWN, buff=0.3, aligned_edge=LEFT).next_to(nfa_states_group, DOWN, buff=1.5)
        
        self.play(Write(nfa_details))
        self.wait(2)
        
        self.play(FadeOut(VGroup(nfa_title, initial_arrow_nfa, nfa_states_group, nfa_transitions_group, nfa_details)))

        # --- Scene 3: Step 1 - DFA Start State ---
        step1_title = Title("Step 1: Determine DFA Start State").to_edge(UP)
        self.play(Write(step1_title))

        formula_text_s1 = MathTex(r"D_0 = \text{Epsilon-Closure}(\text{NFA Start State})").next_to(step1_title, DOWN, buff=0.8)
        self.play(Write(formula_text_s1))

        nfa_start_state_text_s1 = Tex("NFA Start State = $q_0$").next_to(formula_text_s1, DOWN, buff=0.5).set_color(YELLOW)
        self.play(Create(nfa_start_state_text_s1))

        # Epsilon-Closure calculation for q0
        ec_calc_title = Tex("Epsilon-Closure($q_0$):").next_to(nfa_start_state_text_s1, DOWN, buff=0.7).align_to(nfa_start_state_text_s1, LEFT)
        self.play(Write(ec_calc_title))

        initial_set_for_ec = MathTex(r"\{q_0\}").next_to(ec_calc_title, RIGHT, buff=0.5)
        self.play(Create(initial_set_for_ec))

        # In our NFA: q0 has no outgoing epsilon transitions. So, Epsilon-Closure({q0}) is just {q0}.
        
        final_d0_text = MathTex(r"D_0 = \{q_0\}").next_to(ec_calc_title, DOWN, buff=1.5).set_color(BLUE_D)
        self.play(TransformFromCopy(initial_set_for_ec, final_d0_text))
        
        is_final_check = Tex("Is $D_0$ a final state?").next_to(final_d0_text, DOWN, buff=0.7).align_to(final_d0_text, LEFT)
        final_answer = Tex("No, because it does not contain NFA final state $q_1$.").next_to(is_final_check, DOWN, buff=0.3)
        
        self.play(Write(is_final_check))
        self.wait(0.5)
        self.play(Write(final_answer))
        self.wait(1)

        # Draw D0 in the nascent DFA graph
        dfa_d0_state = create_state("D_0", is_final=False, position=DOWN*2).scale(0.8)
        self.play(TransformFromCopy(final_d0_text, dfa_d0_state))

        # List of DFA states found
        dfa_states_found_title = Tex("DFA States Found:").to_edge(RIGHT).shift(UP*2)
        dfa_states_list = Tex(r"$D_0 = \{q_0\}$").next_to(dfa_states_found_title, DOWN, buff=0.3).align_to(dfa_states_found_title, LEFT)
        
        self.play(Write(dfa_states_found_title), Create(dfa_states_list))
        
        self.wait(1)
        self.play(FadeOut(VGroup(step1_title, formula_text_s1, nfa_start_state_text_s1, ec_calc_title, 
                                  initial_set_for_ec, final_d0_text, is_final_check, final_answer)))

        # --- Scene 4: Step 2 - Transitions for D0 ---
        step2_title = Title("Step 2: Calculate Transitions for $D_0 = \{q_0\}$").to_edge(UP)
        self.play(Write(step2_title))

        # NFA reference (smaller, at top-left)
        # We need to copy the *final* NFA objects, not the raw ones, to ensure all elements are present
        nfa_ref_states = VGroup(q0_obj, q1_obj).copy().scale(0.6)
        nfa_ref_initial_arrow = initial_arrow_nfa.copy().scale(0.6)
        nfa_ref_transitions = nfa_transitions_group.copy().scale(0.6)
        
        # Adjust positions of copied elements for the reference group
        nfa_ref_states.move_to(LEFT*4 + UP*2.5) # Center the states
        nfa_ref_initial_arrow.set_x(nfa_ref_states[0].get_left()[0] - 0.5) # Align with the new q0
        nfa_ref_initial_arrow.set_y(nfa_ref_states[0].get_left()[1])
        nfa_ref_initial_arrow.set_angle(0) # Ensure it's horizontal
        nfa_ref_transitions.match_x(nfa_ref_states).match_y(nfa_ref_states) # Match position to states
        
        nfa_ref_group = VGroup(nfa_ref_states, nfa_ref_initial_arrow, nfa_ref_transitions).to_corner(UL).shift(RIGHT*0.5 + DOWN*0.5)
        
        self.play(Create(nfa_ref_group))
        
        formula_delta = MathTex(r"\delta_{\text{DFA}}(D, x) = \text{Epsilon-Closure}(\bigcup_{q \in D} \delta_{\text{NFA}}(q, x))")
        formula_delta.next_to(step2_title, DOWN, buff=0.5).scale(0.7)
        self.play(Write(formula_delta))

        # Move current DFA components to make space
        current_dfa_vis_elements = VGroup(dfa_d0_state, dfa_states_found_title, dfa_states_list)
        self.play(current_dfa_vis_elements.animate.to_corner(DR).shift(LEFT*0.5 + UP*0.5))

        # Get references to the scaled NFA objects within nfa_ref_group
        q0_nfa_ref = nfa_ref_states[0] # q0 state circle in NFA ref
        q1_nfa_ref = nfa_ref_states[1] # q1 state circle in NFA ref

        # Transition for 'a' from D0
        input_a_text_d0 = Tex("For input 'a' from $D_0 = \{q_0\}$:").next_to(formula_delta, DOWN, buff=0.8).align_to(formula_delta, LEFT)
        self.play(Write(input_a_text_d0))

        delta_nfa_q0_a = MathTex(r"\delta_{\text{NFA}}(q_0, 'a') = \{q_0\}").next_to(input_a_text_d0, DOWN, buff=0.3).align_to(input_a_text_d0, LEFT)
        self.play(Create(delta_nfa_q0_a))
        self.play(
            Circumscribe(q0_nfa_ref[0], color=YELLOW), # Highlight q0 NFA circle
            Circumscribe(nfa_ref_transitions[0][0], color=YELLOW) # q0_to_q0 'a' transition arrow
        )
        
        p_a_text_d0 = MathTex(r"P_a = \{q_0\}").next_to(delta_nfa_q0_a, DOWN, buff=0.3).align_to(input_a_text_d0, LEFT)
        self.play(Create(p_a_text_d0))

        ec_pa_text_d0 = MathTex(r"\text{Epsilon-Closure}(P_a) = \text{Epsilon-Closure}(\{q_0\}) = \{q_0\}").next_to(p_a_text_d0, DOWN, buff=0.3).align_to(input_a_text_d0, LEFT)
        self.play(Create(ec_pa_text_d0))
        
        d_new_a_d0 = MathTex(r"\implies D_0 \xrightarrow{a} D_0").next_to(ec_pa_text_d0, DOWN, buff=0.5).set_color(BLUE)
        self.play(Write(d_new_a_d0))

        dfa_d0_a_trans = create_transition(dfa_d0_state[0], dfa_d0_state[0], "a")
        self.play(Create(dfa_d0_a_trans))
        self.wait(1)
        self.play(FadeOut(VGroup(input_a_text_d0, delta_nfa_q0_a, p_a_text_d0, ec_pa_text_d0, d_new_a_d0)))


        # Transition for 'b' from D0
        input_b_text_d0 = Tex("For input 'b' from $D_0 = \{q_0\}$:").next_to(formula_delta, DOWN, buff=0.8).align_to(formula_delta, LEFT)
        self.play(Write(input_b_text_d0))

        delta_nfa_q0_b = MathTex(r"\delta_{\text{NFA}}(q_0, 'b') = \{q_1\}").next_to(input_b_text_d0, DOWN, buff=0.3).align_to(input_b_text_d0, LEFT)
        self.play(Create(delta_nfa_q0_b))
        self.play(
            Circumscribe(q0_nfa_ref[0], color=YELLOW), # Highlight q0 NFA
            Circumscribe(q1_nfa_ref[0], color=YELLOW), # Highlight q1 NFA
            Circumscribe(nfa_ref_transitions[1][0], color=YELLOW) # q0_to_q1 'b' transition arrow
        )

        p_b_text_d0 = MathTex(r"P_b = \{q_1\}").next_to(delta_nfa_q0_b, DOWN, buff=0.3).align_to(input_b_text_d0, LEFT)
        self.play(Create(p_b_text_d0))
        
        ec_pb_text_d0 = MathTex(r"\text{Epsilon-Closure}(P_b) = \text{Epsilon-Closure}(\{q_1\}) = \{q_0, q_1\}").next_to(p_b_text_d0, DOWN, buff=0.3).align_to(input_b_text_d0, LEFT)
        self.play(Create(ec_pb_text_d0))
        self.play(
            Circumscribe(q1_nfa_ref[0], color=GREEN), # Highlight q1 NFA
            Circumscribe(q0_nfa_ref[0], color=GREEN), # Highlight q0 NFA
            Circumscribe(nfa_ref_transitions[2][0], color=GREEN) # q1_to_q0 epsilon transition arrow
        )
        
        d_new_b_d0 = MathTex(r"\implies D_0 \xrightarrow{b} D_1").next_to(ec_pb_text_d0, DOWN, buff=0.5).set_color(BLUE)
        self.play(Write(d_new_b_d0))
        
        # Create new DFA state D1
        dfa_d1_state = create_state("D_1", is_final=True, position=dfa_d0_state.get_right() + RIGHT*2).scale(0.8)
        self.play(Create(dfa_d1_state))

        dfa_d0_b_trans = create_transition(dfa_d0_state[0], dfa_d1_state[0], "b", curve=20)
        self.play(Create(dfa_d0_b_trans))
        
        # Update DFA states found list
        new_dfa_state_entry = Tex(r"$D_1 = \{q_0, q_1\}$").next_to(dfa_states_list, DOWN, buff=0.3).align_to(dfa_states_list, LEFT)
        self.play(Write(new_dfa_state_entry))
        dfa_states_list_group = VGroup(dfa_states_list, new_dfa_state_entry) # Group existing and new for later FadeOut
        
        self.wait(1)
        self.play(FadeOut(VGroup(step2_title, formula_delta, input_b_text_d0, delta_nfa_q0_b, p_b_text_d0, ec_pb_text_d0, d_new_b_d0)))

        # --- Scene 5: Step 3 - Transitions for D1 ---
        step3_title = Title("Step 3: Repeat for $D_1 = \{q_0, q_1\}$").to_edge(UP)
        self.play(Write(step3_title))
        
        # Bring formula back
        formula_delta_copy = formula_delta.copy().next_to(step3_title, DOWN, buff=0.5)
        self.play(FadeIn(formula_delta_copy))

        # Re-arrange DFA components and NFA reference for clarity
        # Group all current DFA visual components
        current_dfa_graph = VGroup(dfa_d0_state, dfa_d0_a_trans, dfa_d0_b_trans, dfa_d1_state)
        self.play(current_dfa_graph.animate.to_corner(DR).shift(LEFT*1 + UP*0.5))
        
        # Reposition the list relative to the *moved* DFA graph
        dfa_states_found_info = VGroup(dfa_states_found_title, dfa_states_list_group)
        self.play(dfa_states_found_info.animate.next_to(current_dfa_graph, LEFT, buff=1.5).align_to(current_dfa_graph, UP))
        
        # Keep NFA reference at top left, re-center slightly if it moved with previous FadeOuts
        self.play(nfa_ref_group.animate.to_corner(UL).shift(RIGHT*0.5 + DOWN*0.5)) 

        # Transition for 'a' from D1
        input_a_text_d1 = Tex("For input 'a' from $D_1 = \{q_0, q_1\}$:").next_to(formula_delta_copy, DOWN, buff=0.8).align_to(formula_delta_copy, LEFT)
        self.play(Write(input_a_text_d1))

        delta_nfa_q0_a_d1 = MathTex(r"\delta_{\text{NFA}}(q_0, 'a') = \{q_0\}").next_to(input_a_text_d1, DOWN, buff=0.3).align_to(input_a_text_d1, LEFT)
        delta_nfa_q1_a_d1 = MathTex(r"\delta_{\text{NFA}}(q_1, 'a') = \{q_1\}").next_to(delta_nfa_q0_a_d1, DOWN, buff=0.3).align_to(input_a_text_d1, LEFT)
        self.play(Create(delta_nfa_q0_a_d1), Create(delta_nfa_q1_a_d1))
        self.play(
            Circumscribe(q0_nfa_ref[0], color=YELLOW), Circumscribe(nfa_ref_transitions[0][0], color=YELLOW), # q0_a
            Circumscribe(q1_nfa_ref[0], color=YELLOW), Circumscribe(nfa_ref_transitions[3][0], color=YELLOW)  # q1_a
        )

        p_a_d1_text = MathTex(r"P_a = \{q_0\} \cup \{q_1\} = \{q_0, q_1\}").next_to(delta_nfa_q1_a_d1, DOWN, buff=0.3).align_to(input_a_text_d1, LEFT)
        self.play(Create(p_a_d1_text))
        
        ec_pa_d1_text = MathTex(r"\text{Epsilon-Closure}(P_a) = \text{Epsilon-Closure}(\{q_0, q_1\}) = \{q_0, q_1\}").next_to(p_a_d1_text, DOWN, buff=0.3).align_to(input_a_text_d1, LEFT)
        self.play(Create(ec_pa_d1_text))
        self.play(
            Circumscribe(q0_nfa_ref[0], color=GREEN), Circumscribe(q1_nfa_ref[0], color=GREEN), # Highlight q0, q1 for epsilon closure
            Circumscribe(nfa_ref_transitions[2][0], color=GREEN) # q1_epsilon_q0 transition
        )
        
        d_new_a_d1 = MathTex(r"\implies D_1 \xrightarrow{a} D_1").next_to(ec_pa_d1_text, DOWN, buff=0.5).set_color(BLUE)
        self.play(Write(d_new_a_d1))
        
        dfa_d1_a_trans = create_transition(dfa_d1_state[0], dfa_d1_state[0], "a")
        self.play(Create(dfa_d1_a_trans))
        self.wait(1)
        self.play(FadeOut(VGroup(input_a_text_d1, delta_nfa_q0_a_d1, delta_nfa_q1_a_d1, p_a_d1_text, ec_pa_d1_text, d_new_a_d1)))

        # Transition for 'b' from D1
        input_b_text_d1 = Tex("For input 'b' from $D_1 = \{q_0, q_1\}$:").next_to(formula_delta_copy, DOWN, buff=0.8).align_to(formula_delta_copy, LEFT)
        self.play(Write(input_b_text_d1))
        
        delta_nfa_q0_b_d1 = MathTex(r"\delta_{\text{NFA}}(q_0, 'b') = \{q_1\}").next_to(input_b_text_d1, DOWN, buff=0.3).align_to(input_b_text_d1, LEFT)
        delta_nfa_q1_b_d1 = MathTex(r"\delta_{\text{NFA}}(q_1, 'b') = \emptyset").next_to(delta_nfa_q0_b_d1, DOWN, buff=0.3).align_to(input_b_text_d1, LEFT)
        self.play(Create(delta_nfa_q0_b_d1), Create(delta_nfa_q1_b_d1))
        self.play(
            Circumscribe(q0_nfa_ref[0], color=YELLOW), # q0 NFA
            Circumscribe(q1_nfa_ref[0], color=YELLOW), # q1 NFA
            Circumscribe(nfa_ref_transitions[1][0], color=YELLOW) # q0_b
        )

        p_b_d1_text = MathTex(r"P_b = \{q_1\} \cup \emptyset = \{q_1\}").next_to(delta_nfa_q1_b_d1, DOWN, buff=0.3).align_to(input_b_text_d1, LEFT)
        self.play(Create(p_b_d1_text))
        
        ec_pb_d1_text = MathTex(r"\text{Epsilon-Closure}(P_b) = \text{Epsilon-Closure}(\{q_1\}) = \{q_0, q_1\}").next_to(p_b_d1_text, DOWN, buff=0.3).align_to(input_b_text_d1, LEFT)
        self.play(Create(ec_pb_d1_text))
        self.play(
            Circumscribe(q0_nfa_ref[0], color=GREEN), Circumscribe(q1_nfa_ref[0], color=GREEN), # Highlight q0, q1
            Circumscribe(nfa_ref_transitions[2][0], color=GREEN) # q1_epsilon_q0 transition
        )
        
        d_new_b_d1 = MathTex(r"\implies D_1 \xrightarrow{b} D_1").next_to(ec_pb_d1_text, DOWN, buff=0.5).set_color(BLUE)
        self.play(Write(d_new_b_d1))
        
        dfa_d1_b_trans = create_transition(dfa_d1_state[0], dfa_d1_state[0], "b")
        self.play(Create(dfa_d1_b_trans))

        no_new_states_text = Tex("No new DFA states found. Conversion complete!").next_to(d_new_b_d1, DOWN, buff=0.8).set_color(GREEN) # FIX: Changed GREEN_SCREEN to GREEN
        self.play(Write(no_new_states_text))
        self.wait(2)
        
        self.play(FadeOut(VGroup(step3_title, formula_delta_copy, input_b_text_d1, delta_nfa_q0_b_d1, delta_nfa_q1_b_d1, p_b_d1_text, ec_pb_d1_text, d_new_b_d1, no_new_states_text, nfa_ref_group, dfa_states_found_info))) # Fade out dfa_states_found_info, which contains dfa_states_found_title and dfa_states_list_group

        # --- Scene 6: Final DFA ---
        final_dfa_title = Title("The Resulting DFA").to_edge(UP)
        self.play(Write(final_dfa_title))

        # Re-position DFA states for a clean final display
        dfa_d0_final_pos = LEFT * 2
        dfa_d1_final_pos = RIGHT * 2

        final_dfa_d0 = create_state("D_0", is_final=False, position=dfa_d0_final_pos)
        final_dfa_d1 = create_state("D_1", is_final=True, position=dfa_d1_final_pos)

        # Recreate transitions for the final layout, referencing the new positions
        final_dfa_d0_a = create_transition(final_dfa_d0[0], final_dfa_d0[0], "a")
        final_dfa_d0_b = create_transition(final_dfa_d0[0], final_dfa_d1[0], "b", curve=20)
        final_dfa_d1_a = create_transition(final_dfa_d1[0], final_dfa_d1[0], "a")
        final_dfa_d1_b = create_transition(final_dfa_d1[0], final_dfa_d1[0], "b")

        final_initial_arrow_dfa = Arrow(start=dfa_d0_final_pos + LEFT*1.5, end=final_dfa_d0[0].get_left(), buff=0.1, stroke_width=3, max_tip_length_to_length_ratio=0.15)

        # Use Transform to move and update the existing objects
        self.play(
            Transform(dfa_d0_state, final_dfa_d0),
            Transform(dfa_d1_state, final_dfa_d1),
            Transform(dfa_d0_a_trans, final_dfa_d0_a),
            Transform(dfa_d0_b_trans, final_dfa_d0_b),
            Transform(dfa_d1_a_trans, final_dfa_d1_a),
            Transform(dfa_d1_b_trans, final_dfa_d1_b),
            Create(final_initial_arrow_dfa) # This arrow is new
        )
        
        final_dfa_description = VGroup(
            Tex("States: {$D_0, D_1$}"),
            Tex("Alphabet: {a, b}"),
            Tex("Start State: $D_0$"),
            Tex("Final State: $D_1$")
        ).arrange(DOWN, buff=0.3, aligned_edge=LEFT).next_to(final_dfa_d0, DOWN, buff=1.5)

        self.play(Write(final_dfa_description))
        self.wait(3)

        self.play(FadeOut(VGroup(final_dfa_title, dfa_d0_state, dfa_d1_state, dfa_d0_a_trans,
                                  dfa_d0_b_trans, dfa_d1_a_trans, dfa_d1_b_trans, 
                                  final_initial_arrow_dfa, final_dfa_description)))

        # --- Scene 7: Summary ---
        summary_title = Title("Summary").to_edge(UP)
        self.play(Write(summary_title))

        summary_points = VGroup(
            Tex("1. DFA Start State = Epsilon-Closure(NFA Start State)."),
            Tex("2. For each new DFA state D and input symbol $x$:"),
            Tex("   a) Compute $P_x = \\bigcup_{q \\in D} \\delta_{\\text{NFA}}(q, x)$."),
            Tex("   b) Next DFA state = Epsilon-Closure($P_x$). This is a new DFA state or an existing one."),
            Tex("3. Repeat step 2 until no new DFA states are found."),
            Tex("4. A DFA state is final if it contains any NFA final state.")
        ).arrange(DOWN, buff=0.6, aligned_edge=LEFT).next_to(summary_title, DOWN, buff=0.8).scale(0.8)

        for point in summary_points:
            self.play(Create(point), run_time=1.5)
            self.wait(1)

        self.wait(3)
        self.play(FadeOut(VGroup(summary_title, summary_points)))
        self.wait(1)