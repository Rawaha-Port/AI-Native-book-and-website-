# Chapter 7: Projects & Labs

## 7.1 Introduction
Throughout this textbook, we have journeyed from the theoretical underpinnings of Physical AI and Humanoid Robotics to the intricate details of robot anatomy, motion control, and intelligent decision-making. This final chapter is dedicated to bridging the gap between theory and practice. It provides a curated set of project ideas and advanced lab exercises, encouraging you to apply the knowledge and skills you've acquired. Engaging in these hands-on activities will solidify your understanding, develop your problem-solving abilities, and inspire you to contribute to the exciting future of robotics. Whether you choose to work on a single focused lab or embark on a more extensive semester-long project, the goal is to build, test, and learn.

## 7.2 Project Ideas
Here are several project ideas that build upon the concepts covered in previous chapters. These can be adapted for varying levels of complexity and scope.

### 7.2.1 Simple Robot Arm Controller
**Objective**: Develop a Python script to control a simulated 3-degree-of-freedom (3-DOF) robot arm (e.g., a planar arm) to reach a specified target position.
-   **Phase 1 (Basic FK)**: Implement the Forward Kinematics (FK) for your chosen arm and use `pybullet` to display the end-effector position as you manually set joint angles.
-   **Phase 2 (Basic IK)**: Implement a basic Inverse Kinematics (IK) solver. For a simple 3-DOF arm, an analytical solution might be feasible, or you can use a numerical iterative method (e.g., Jacobian-based IK).
-   **Phase 3 (Control)**: Implement a simple PID controller to move the arm from its current position to the target IK solution.

### 7.2.2 Bipedal Robot Balance Control (2D)
**Objective**: Implement a basic balance controller for a simulated 2D bipedal robot (a "stick figure" robot with a torso and two legs) in PyBullet.
-   **Phase 1 (Model Setup)**: Create or find a simple 2D bipedal URDF model.
-   **Phase 2 (Sensor Feedback)**: Read the robot's torso orientation (e.g., using a simulated IMU or `getBasePositionAndOrientation`).
-   **Phase 3 (Balance Controller)**: Implement a PID controller that applies torque to the hip joints to keep the torso upright. You can challenge yourself by adding a disturbance (e.g., a small external force) and seeing how the controller reacts.

### 7.2.3 Object Grasping with Vision
**Objective**: Develop a system where a simulated robot arm can visually identify and grasp a specific object (e.g., a cube of a particular color) in its environment.
-   **Phase 1 (Setup)**: Place a simple robot arm and a few distinct objects (e.g., colored blocks) in the PyBullet environment.
-   **Phase 2 (Vision)**: Use PyBullet's rendering capabilities (`p.getCameraImage`) to simulate a camera feed. Process this image using simple computer vision techniques (e.g., color thresholding or a pre-trained object detector if you're familiar with OpenCV or a deep learning framework) to find the target object's position.
-   **Phase 3 (Grasping)**: Use Inverse Kinematics (IK) and position control to move the robot's gripper to the object's position and simulate a grasp.

### 7.2.4 Human-Robot Interaction Chatbot
**Objective**: Extend the conceptual social interaction script from Chapter 5 to include more sophisticated natural language processing and trigger specific robot actions.
-   **Phase 1 (NLP Integration)**: Instead of simple keyword matching, integrate a more robust NLP library (e.g., SpaCy or NLTK) for intent recognition.
-   **Phase 2 (Action Mapping)**: Map specific user intents to PyBullet robot actions (e.g., "wave hand" -> set arm joint angles, "look at me" -> turn head joint).
-   **Phase 3 (State Management)**: Implement a more complex conversation flow, perhaps with memory of past interactions or the ability to ask clarifying questions.

## 7.3 Advanced Lab Exercises
These exercises are designed to push your understanding and implementation skills further.

### Exercise 7.1: Implementing a Basic A* Path Planner
**Objective**: Implement the A* pathfinding algorithm from scratch on a 2D grid and visualize its output.
-   **Setup**: Create a 2D grid (e.g., a NumPy array) representing the environment, with obstacles marked. Define a start and goal point.
-   **Implementation**: Implement the A* algorithm, including a heuristic function (e.g., Manhattan distance or Euclidean distance).
-   **Visualization**: Visualize the grid, obstacles, the explored nodes, and the final path found by the algorithm.
-   **Extension**: Integrate this path planner with the simple mobile robot from Chapter 4's programming lab to make the robot follow the generated path.

### Exercise 7.2: Full PID Controller for a Simulated Joint
**Objective**: Implement a full Proportional-Integral-Derivative (PID) controller for a single revolute joint of a simulated robot in PyBullet.
-   **Setup**: Load a robot model and identify a single joint you want to control (e.g., a shoulder joint).
-   **Implementation**:
    1.  Create a loop that continuously reads the joint's current position (`p.getJointState`).
    2.  Implement the PID algorithm: `error = target_position - current_position`, calculate P, I, D terms.
    3.  Apply the PID output as a torque to the joint (`p.setJointMotorControl2` with `controlMode=p.TORQUE_CONTROL`).
-   **Tuning**: Experimentally tune the Kp, Ki, Kd gains to achieve a desired response (e.g., fast response with minimal overshoot).
-   **Analysis**: Plot the joint's position over time and the error signal to evaluate controller performance.

## 7.4 Semester Project Guidelines
For a more ambitious, longer-term project, consider the following phases:
1.  **Problem Identification**: Choose a specific real-world problem that a humanoid robot could help solve. Clearly define the robot's role and the project's scope.
2.  **Design & Planning**:
    -   **Requirements**: Detail the functional and non-functional requirements.
    -   **Architecture**: Sketch the software and hardware (simulated) architecture.
    -   **Timeline**: Break down the project into manageable milestones.
3.  **Implementation & Testing**:
    -   **Iterative Development**: Build and test components incrementally.
    -   **Version Control**: Use Git to manage your code.
    -   **Debugging**: Systematically identify and resolve issues.
4.  **Documentation & Presentation**:
    -   **Project Report**: Document your design choices, implementation details, results, and future work.
    -   **Demonstration**: Prepare a video or live demo of your robot performing its task in simulation.

## 7.5 Programming Lab

### 7.5.1 Setting up the Environment
Ensure Python, `pybullet`, and `numpy` are installed. For plotting, you might also want `matplotlib`.
```bash
pip install pybullet numpy matplotlib
```

### 7.5.2 Code Snippet: Interactive Joint Control with PID Visualization
This lab extends previous interactive joint control by allowing you to specify a target position and visualizing the PID control action and joint response.

```python
import pybullet as p
import pybullet_data
import time
import numpy as np
import matplotlib.pyplot as plt

# --- PID Controller Class ---
class PIDController:
    def __init__(self, Kp, Ki, Kd, output_limits=(-10, 10)):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.output_limits = output_limits

        self._prev_error = 0.0
        self._integral = 0.0
        self._last_time = None

    def update(self, current_value, target_value, dt):
        error = target_value - current_value

        # Proportional term
        P_term = self.Kp * error

        # Integral term
        self._integral += error * dt
        I_term = self.Ki * self._integral

        # Derivative term
        D_term = self.Kd * (error - self._prev_error) / dt if dt > 0 else 0.0
        self._prev_error = error

        output = P_term + I_term + D_term
        
        # Apply output limits
        output = max(self.output_limits[0], min(self.output_limits[1], output))
        return output

# --- Simulation Setup ---
p.connect(p.GUI)
p.setAdditionalSearchPath(pybullet_data.getDataPath())
p.setGravity(0, 0, -9.81)
p.loadURDF("plane.urdf")

# Load a simple robot with some joints, like the KUKA arm
robotId = p.loadURDF("kuka_lbr_iiwa/model.urdf", [0, 0, 0])
num_joints = p.getNumJoints(robotId)

# --- Select a Joint to Control ---
controlled_joint_index = 0 # Let's control the first joint
joint_info = p.getJointInfo(robotId, controlled_joint_index)
joint_lower_limit = joint_info[8]
joint_upper_limit = joint_info[9]
joint_name = joint_info[1].decode('utf-8')

print(f"Controlling Joint: {joint_name} (Index: {controlled_joint_index})")

# --- Create GUI for Target and PID Gains ---
target_slider_id = p.addUserDebugParameter(f"Target Angle ({joint_name})", joint_lower_limit, joint_upper_limit, 0)
kp_slider_id = p.addUserDebugParameter("Kp", 0, 10, 2)
ki_slider_id = p.addUserDebugParameter("Ki", 0, 5, 0.1)
kd_slider_id = p.addUserDebugParameter("Kd", 0, 5, 0.5)
max_torque_slider_id = p.addUserDebugParameter("Max Torque", 1, 100, 50)

# --- Data Logging for Plotting ---
time_data = []
position_data = []
target_data = []
error_data = []
control_output_data = []

# --- Simulation Loop ---
sim_time = 0.0
time_step = 1.0 / 240.0 # PyBullet's default simulation time step
p.setPhysicsEngineParameter(fixedTimeStep=time_step)

pid_controller = PIDController(Kp=p.readUserDebugParameter(kp_slider_id),
                               Ki=p.readUserDebugParameter(ki_slider_id),
                               Kd=p.readUserDebugParameter(kd_slider_id))

start_time = time.time()
while (p.isConnected()):
    current_time = time.time()
    if pid_controller._last_time is None:
        pid_controller._last_time = current_time
        dt = time_step
    else:
        dt = current_time - pid_controller._last_time
        pid_controller._last_time = current_time

    # Read GUI parameters
    target_angle = p.readUserDebugParameter(target_slider_id)
    Kp = p.readUserDebugParameter(kp_slider_id)
    Ki = p.readUserDebugParameter(ki_slider_id)
    Kd = p.readUserDebugParameter(kd_slider_id)
    max_torque = p.readUserDebugParameter(max_torque_slider_id)

    # Update PID gains (can be done interactively)
    pid_controller.Kp = Kp
    pid_controller.Ki = Ki
    pid_controller.Kd = Kd
    pid_controller.output_limits = (-max_torque, max_torque)

    # Get current joint position
    joint_state = p.getJointState(robotId, controlled_joint_index)
    current_position = joint_state[0]

    # Calculate control output
    control_output = pid_controller.update(current_position, target_angle, dt)

    # Apply control output as torque
    p.setJointMotorControl2(
        bodyUniqueId=robotId,
        jointIndex=controlled_joint_index,
        controlMode=p.TORQUE_CONTROL, # Now we are applying explicit torque
        force=control_output # 'force' parameter is the torque for revolute joints
    )
    
    # Step simulation
    p.stepSimulation()
    sim_time += time_step
    
    # Log data
    time_data.append(sim_time)
    position_data.append(current_position)
    target_data.append(target_angle)
    error_data.append(target_angle - current_position)
    control_output_data.append(control_output)

    # Sleep to slow down real-time if needed
    time.sleep(max(0, time_step - (time.time() - current_time))) # Ensure consistent simulation time if possible
    
# Disconnect from PyBullet
p.disconnect()

# --- Plotting Results ---
plt.figure(figsize=(12, 8))

plt.subplot(3, 1, 1)
plt.plot(time_data, target_data, label="Target Position", linestyle='--')
plt.plot(time_data, position_data, label="Actual Position")
plt.title(f"Joint Position Tracking for {joint_name}")
plt.xlabel("Time (s)")
plt.ylabel("Position (rad)")
plt.legend()
plt.grid(True)

plt.subplot(3, 1, 2)
plt.plot(time_data, error_data, label="Error (Target - Actual)", color='red')
plt.title("Tracking Error")
plt.xlabel("Time (s)")
plt.ylabel("Error (rad)")
plt.legend()
plt.grid(True)

plt.subplot(3, 1, 3)
plt.plot(time_data, control_output_data, label="Control Output (Torque)", color='green')
plt.title("Control Output")
plt.xlabel("Time (s)")
plt.ylabel("Torque (Nm)")
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()

print("Simulation and plotting finished.")
```
**Explanation:**
-   **PIDController Class**: We've implemented a simple PID controller as a Python class. This allows you to set `Kp`, `Ki`, and `Kd` gains and calculate the control output.
-   **GUI Sliders**: New sliders are added to the PyBullet GUI to allow interactive tuning of `Kp`, `Ki`, `Kd`, and the maximum output torque.
-   **`p.TORQUE_CONTROL`**: Crucially, we now use `controlMode=p.TORQUE_CONTROL` in `p.setJointMotorControl2`. This means we are directly applying the torque calculated by our PID controller to the joint, rather than PyBullet's internal position controller.
-   **Data Logging**: The `time_data`, `position_data`, `target_data`, `error_data`, and `control_output_data` lists store values from each simulation step.
-   **Matplotlib Plotting**: After the simulation, `matplotlib` is used to plot the joint's actual position against the target, the tracking error, and the control output (torque). This visualization is essential for understanding how your PID controller performs and for fine-tuning the gains.

## 7.6 Chapter Summary
This final chapter served as a launchpad for applying the theoretical and practical knowledge gained throughout this textbook. We explored a range of project ideas, from building robot arm controllers and balance systems to integrating vision for grasping and designing human-robot interaction chatbots. Advanced lab exercises challenged you to implement core robotics algorithms like A* pathfinding and full PID control. The overarching goal has been to move beyond passive learning to active creation, fostering critical thinking, problem-solving, and a deeper appreciation for the engineering challenges and triumphs in Physical AI and Humanoid Robotics.

## 7.7 Further Learning Roadmaps
Your journey into Physical AI and Humanoid Robotics is just beginning! Consider these paths for continued learning:
-   **Advanced Robotics Courses**: Explore specialized topics like optimal control, whole-body dynamics, human-robot collaboration, and ethical AI design.
-   **Research Areas**: Delve into cutting-edge fields such as tactile sensing, compliant robotics, bio-inspired robotics, and advanced reinforcement learning for complex manipulation.
-   **Robotics Competitions**: Participate in challenges like RoboCup, DARPA Robotics Challenge, or local university robotics competitions to test your skills in a competitive, team-based environment.
-   **Open-Source Projects**: Contribute to existing open-source robotics projects (e.g., ROS, Gazebo) or start your own.
-   **Community Engagement**: Join robotics forums, attend workshops, and connect with other enthusiasts and professionals in the field.

The future of Physical AI and Humanoid Robotics is bright and full of unsolved problems waiting for innovative minds like yours. Go forth and build the future!
