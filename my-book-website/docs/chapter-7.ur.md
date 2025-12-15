# باب 7: پروجیکٹس اور لیبز

## 7.1 تعارف
اس پوری درسی کتاب میں، ہم نے فزیکل AI اور ہیومنائڈ روبوٹکس کی نظریاتی بنیادوں سے لے کر روبوٹ اناٹومی، موشن کنٹرول، اور ذہین فیصلہ سازی کی پیچیدہ تفصیلات تک کا سفر کیا ہے۔ یہ آخری باب نظریہ اور عمل کے درمیان فرق کو ختم کرنے کے لیے وقف ہے۔ یہ پروجیکٹ آئیڈیاز اور جدید لیب مشقوں کا ایک منتخب سیٹ فراہم کرتا ہے، جو آپ کو حاصل کردہ علم اور مہارتوں کو لاگو کرنے کی ترغیب دیتا ہے۔ ان عملی سرگرمیوں میں مشغول ہونے سے آپ کی سمجھ مضبوط ہوگی، آپ کی مسئلہ حل کرنے کی صلاحیتیں پیدا ہوں گی، اور آپ کو روبوٹکس کے دلچسپ مستقبل میں حصہ ڈالنے کی ترغیب ملے گی۔ چاہے آپ ایک واحد مرکوز لیب پر کام کرنے کا انتخاب کریں یا ایک زیادہ وسیع سمسٹر طویل پروجیکٹ شروع کریں، مقصد تعمیر کرنا، جانچنا، اور سیکھنا ہے۔

## 7.2 پروجیکٹ آئیڈیاز
یہاں کئی پروجیکٹ آئیڈیاز ہیں جو پچھلے ابواب میں شامل تصورات پر مبنی ہیں۔ انہیں پیچیدگی اور دائرہ کار کی مختلف سطحوں کے لیے ڈھالا جا سکتا ہے۔

### 7.2.1 سادہ روبوٹ بازو کنٹرولر
**مقصد**: ایک مخصوص ہدف کی پوزیشن تک پہنچنے کے لیے ایک سمیلیٹڈ 3-ڈگری-آف-فریڈم (3-DOF) روبوٹ بازو (جیسے، ایک پلانر بازو) کو کنٹرول کرنے کے لیے ایک Python اسکرپٹ تیار کریں۔
- **مرحلہ 1 (بنیادی FK)**: اپنے منتخب کردہ بازو کے لیے فارورڈ کائیمیٹکس (FK) کو نافذ کریں اور `pybullet` کا استعمال کرکے اینڈ-ایفیکٹر کی پوزیشن کو ظاہر کریں جب آپ دستی طور پر جوڑوں کے زاویے سیٹ کرتے ہیں۔
- **مرحلہ 2 (بنیادی IK)**: ایک بنیادی انورس کائیمیٹکس (IK) سالور کو نافذ کریں۔ ایک سادہ 3-DOF بازو کے لیے، ایک تجزیاتی حل ممکن ہو سکتا ہے، یا آپ ایک عددی تکراری طریقہ (جیسے، جیکوبین پر مبنی IK) استعمال کر سکتے ہیں۔
- **مرحلہ 3 (کنٹرول)**: بازو کو اس کی موجودہ پوزیشن سے ہدف IK حل تک منتقل کرنے کے لیے ایک سادہ PID کنٹرولر کو نافذ کریں۔

### 7.2.2 دوپایہ روبوٹ بیلنس کنٹرول (2D)
**مقصد**: PyBullet میں ایک سمیلیٹڈ 2D دوپایہ روبوٹ (ایک "اسٹک فگر" روبوٹ جس میں ایک دھڑ اور دو ٹانگیں ہیں) کے لیے ایک بنیادی بیلنس کنٹرولر کو نافذ کریں۔
- **مرحلہ 1 (ماڈل سیٹ اپ)**: ایک سادہ 2D دوپایہ URDF ماڈل بنائیں یا تلاش کریں۔
- **مرحلہ 2 (سینسر فیڈ بیک)**: روبوٹ کے دھڑ کی سمت پڑھیں (جیسے، ایک سمیلیٹڈ IMU یا `getBasePositionAndOrientation` کا استعمال کرتے ہوئے)۔
- **مرحلہ 3 (بیلنس کنٹرولر)**: ایک PID کنٹرولر کو نافذ کریں جو دھڑ کو سیدھا رکھنے کے لیے کولہے کے جوڑوں پر ٹارک لگاتا ہے۔ آپ خود کو ایک خلل (جیسے، ایک چھوٹی بیرونی قوت) شامل کرکے چیلنج کر سکتے ہیں اور دیکھ سکتے ہیں کہ کنٹرولر کیسا ردعمل ظاہر کرتا ہے۔

### 7.2.3 ویژن کے ساتھ آبجیکٹ گرفت
**مقصد**: ایک ایسا نظام تیار کریں جہاں ایک سمیلیٹڈ روبوٹ بازو اپنے ماحول میں ایک مخصوص چیز (جیسے، ایک خاص رنگ کا کیوب) کو بصری طور پر شناخت اور گرفت کر سکے۔
- **مرحلہ 1 (سیٹ اپ)**: PyBullet ماحول میں ایک سادہ روبوٹ بازو اور چند الگ الگ اشیاء (جیسے، رنگین بلاکس) رکھیں۔
- **مرحلہ 2 (ویژن)**: کیمرہ فیڈ کو سمیولیٹ کرنے کے لیے PyBullet کی رینڈرنگ صلاحیتوں (`p.getCameraImage`) کا استعمال کریں۔ اس تصویر کو سادہ کمپیوٹر ویژن تکنیک (جیسے، رنگ کی حد بندی یا اگر آپ OpenCV یا ڈیپ لرننگ فریم ورک سے واقف ہیں تو ایک پہلے سے تربیت یافتہ آبجیکٹ ڈیٹیکٹر) کا استعمال کرتے ہوئے ہدف آبجیکٹ کی پوزیشن تلاش کرنے کے لیے پروسیس کریں۔
- **مرحلہ 3 (گرفت)**: روبوٹ کے گرپر کو آبجیکٹ کی پوزیشن پر منتقل کرنے اور گرفت کو سمیولیٹ کرنے کے لیے انورس کائیمیٹکس (IK) اور پوزیشن کنٹرول کا استعمال کریں۔

### 7.2.4 انسانی-روبوٹ تعامل چیٹ بوٹ
**مقصد**: باب 5 سے تصوراتی سماجی تعامل اسکرپٹ کو مزید جدید قدرتی زبان کی پروسیسنگ اور مخصوص روبوٹ اعمال کو متحرک کرنے کے لیے بڑھائیں۔
- **مرحلہ 1 (NLP انضمام)**: سادہ مطلوبہ الفاظ کی مماثلت کے بجائے، ارادے کی شناخت کے لیے ایک زیادہ مضبوط NLP لائبریری (جیسے، SpaCy یا NLTK) کو مربوط کریں۔
- **مرحلہ 2 (ایکشن میپنگ)**: مخصوص صارف کے ارادوں کو PyBullet روبوٹ اعمال پر میپ کریں (جیسے، "ہاتھ ہلاؤ" -> بازو کے جوڑوں کے زاویے سیٹ کریں، "میری طرف دیکھو" -> سر کا جوڑ گھمائیں)۔
- **مرحلہ 3 (اسٹیٹ مینجمنٹ)**: ایک زیادہ پیچیدہ گفتگو کا بہاؤ نافذ کریں، شاید ماضی کے تعاملات کی یادداشت یا واضح کرنے والے سوالات پوچھنے کی صلاحیت کے ساتھ۔

## 7.3 جدید لیب مشقیں
یہ مشقیں آپ کی سمجھ اور نفاذ کی مہارتوں کو مزید آگے بڑھانے کے لیے ڈیزائن کی گئی ہیں۔

### مشق 7.1: ایک بنیادی A* پاتھ پلانر کو نافذ کرنا
**مقصد**: A* پاتھ فائنڈنگ الگورتھم کو شروع سے 2D گرڈ پر نافذ کریں اور اس کے آؤٹ پٹ کا تصور کریں۔
- **سیٹ اپ**: ماحول کی نمائندگی کرنے والا ایک 2D گرڈ (جیسے، ایک NumPy ارے) بنائیں، جس میں رکاوٹیں نشان زد ہوں۔ ایک آغاز اور مقصد کا نقطہ بیان کریں۔
- **نفاذ**: A* الگورتھم کو نافذ کریں، بشمول ایک ہیورسٹک فنکشن (جیسے، مین ہٹن فاصلہ یا یوکلیڈین فاصلہ)۔
- **تصور**: گرڈ، رکاوٹوں، دریافت شدہ نوڈس، اور الگورتھم کے ذریعہ پائے جانے والے حتمی راستے کا تصور کریں۔
- **توسیع**: اس پاتھ پلانر کو باب 4 کی پروگرامنگ لیب سے سادہ موبائل روبوٹ کے ساتھ مربوط کریں تاکہ روبوٹ پیدا کردہ راستے پر عمل کرے۔

### مشق 7.2: ایک سمیلیٹڈ جوڑ کے لیے مکمل PID کنٹرولر
**مقصد**: PyBullet میں ایک سمیلیٹڈ روبوٹ کے ایک واحد ریولوٹ جوڑ کے لیے ایک مکمل تناسبی-انٹیگرل-ڈیریویٹیو (PID) کنٹرولر کو نافذ کریں۔
- **سیٹ اپ**: ایک روبوٹ ماڈل لوڈ کریں اور ایک واحد جوڑ کی شناخت کریں جسے آپ کنٹرول کرنا چاہتے ہیں (جیسے، کندھے کا جوڑ)۔
- **نفاذ**:
    1. ایک لوپ بنائیں جو مسلسل جوڑ کی موجودہ پوزیشن (`p.getJointState`) کو پڑھتا ہے۔
    2. PID الگورتھم کو نافذ کریں: `error = target_position - current_position`، P, I, D اصطلاحات کا حساب لگائیں۔
    3. PID آؤٹ پٹ کو جوڑ پر ٹارک کے طور پر لاگو کریں (`p.setJointMotorControl2` مع `controlMode=p.TORQUE_CONTROL`)۔
- **ٹیوننگ**: مطلوبہ ردعمل حاصل کرنے کے لیے Kp, Ki, Kd گینز کو تجرباتی طور پر ٹیون کریں (جیسے، کم سے کم اوور شوٹ کے ساتھ تیز ردعمل)۔
- **تجزیہ**: کنٹرولر کی کارکردگی کا جائزہ لینے کے لیے وقت کے ساتھ جوڑ کی پوزیشن اور غلطی سگنل کو پلاٹ کریں۔

## 7.4 سمسٹر پروجیکٹ کے رہنما خطوط
ایک زیادہ مہتواکانکشی، طویل مدتی پروجیکٹ کے لیے، مندرجہ ذیل مراحل پر غور کریں:
1. **مسئلے کی شناخت**: ایک مخصوص حقیقی دنیا کا مسئلہ منتخب کریں جسے ایک ہیومنائڈ روبوٹ حل کرنے میں مدد کر سکتا ہے۔ روبوٹ کے کردار اور پروجیکٹ کے دائرہ کار کی واضح طور پر وضاحت کریں۔
2. **ڈیزائن اور منصوبہ بندی**:
    - **ضروریات**: فعال اور غیر فعال ضروریات کی تفصیل دیں۔
    - **فن تعمیر**: سافٹ ویئر اور ہارڈ ویئر (سمیلیٹڈ) فن تعمیر کا خاکہ بنائیں۔
    - **ٹائم لائن**: پروجیکٹ کو قابل انتظام سنگ میل میں توڑ دیں۔
3. **نفاذ اور جانچ**:
    - **تکراری ترقی**: اجزاء کو بتدریج بنائیں اور جانچیں۔
    - **ورژن کنٹرول**: اپنے کوڈ کو منظم کرنے کے لیے Git کا استعمال کریں۔
    - **ڈیبگنگ**: مسائل کی منظم طریقے سے شناخت اور حل کریں۔
4. **دستاویزی اور پیشکش**:
    - **پروجیکٹ رپورٹ**: اپنے ڈیزائن کے انتخاب، نفاذ کی تفصیلات، نتائج، اور مستقبل کے کام کی دستاویز بنایں۔
    - **مظاہرہ**: سیمولیشن میں اپنے روبوٹ کو اس کا کام انجام دیتے ہوئے ایک ویڈیو یا لائیو ڈیمو تیار کریں۔

## 7.5 پروگرامنگ لیب

### 7.5.1 ماحول کو ترتیب دینا
یقینی بنائیں کہ Python, `pybullet`, اور `numpy` انسٹال ہیں۔ پلاٹنگ کے لیے، آپ کو `matplotlib` بھی چاہئے۔
```bash
pip install pybullet numpy matplotlib
```

### 7.5.2 کوڈ کا ٹکڑا: PID تصور کے ساتھ انٹرایکٹو جوائنٹ کنٹرول
یہ لیب آپ کو ایک ہدف کی پوزیشن کی وضاحت کرنے اور PID کنٹرول ایکشن اور جوڑ کے ردعمل کا تصور کرکے پچھلے انٹرایکٹو جوائنٹ کنٹرول کو بڑھاتی ہے۔

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
**وضاحت:**
- **PIDController کلاس**: ہم نے ایک سادہ PID کنٹرولر کو ایک Python کلاس کے طور پر نافذ کیا ہے۔ یہ آپ کو `Kp`, `Ki`, اور `Kd` گینز سیٹ کرنے اور کنٹرول آؤٹ پٹ کا حساب لگانے کی اجازت دیتا ہے۔
- **GUI سلائیڈرز**: `Kp`, `Ki`, `Kd`، اور زیادہ سے زیادہ آؤٹ پٹ ٹارک کی انٹرایکٹو ٹیوننگ کی اجازت دینے کے لیے PyBullet GUI میں نئے سلائیڈرز شامل کیے گئے ہیں۔
- **`p.TORQUE_CONTROL`**: اہم بات یہ ہے کہ اب ہم `p.setJointMotorControl2` میں `controlMode=p.TORQUE_CONTROL` کا استعمال کرتے ہیں۔ اس کا مطلب ہے کہ ہم اپنے PID کنٹرولر کے ذریعہ شمار کردہ ٹارک کو براہ راست جوڑ پر لاگو کر رہے ہیں، بجائے PyBullet کے اندرونی پوزیشن کنٹرولر کے۔
- **ڈیٹا لاگنگ**: `time_data`, `position_data`, `target_data`, `error_data`، اور `control_output_data` فہرستیں ہر سیمولیشن قدم سے اقدار کو ذخیرہ کرتی ہیں۔
- **Matplotlib پلاٹنگ**: سیمولیشن کے بعد، `matplotlib` کا استعمال جوڑ کی اصل پوزیشن کو ہدف کے خلاف، ٹریکنگ کی خرابی، اور کنٹرول آؤٹ پٹ (ٹارک) کو پلاٹ کرنے کے لیے کیا جاتا ہے۔ یہ تصور آپ کے PID کنٹرولر کی کارکردگی کو سمجھنے اور گینز کو ٹھیک کرنے کے لیے ضروری ہے۔

## 7.6 باب کا خلاصہ
یہ آخری باب اس درسی کتاب میں حاصل کردہ نظریاتی اور عملی علم کو لاگو کرنے کے لیے ایک لانچ پیڈ کے طور پر کام کرتا ہے۔ ہم نے روبوٹ بازو کنٹرولرز اور بیلنس سسٹمز بنانے سے لے کر گرفت کے لیے ویژن کو مربوط کرنے اور انسانی-روبوٹ تعامل چیٹ بوٹس کو ڈیزائن کرنے تک کے پروجیکٹ آئیڈیاز کی ایک رینج کا جائزہ لیا۔ جدید لیب مشقوں نے آپ کو A* پاتھ فائنڈنگ اور مکمل PID کنٹرول جیسے بنیادی روبوٹکس الگورتھم کو نافذ کرنے کے لیے چیلنج کیا۔ بنیادی مقصد غیر فعال سیکھنے سے فعال تخلیق کی طرف بڑھنا رہا ہے، تنقیدی سوچ، مسئلہ حل کرنے، اور فزیکل AI اور ہیومنائڈ روبوٹکس میں انجینئرنگ چیلنجوں اور کامیابیوں کے لیے گہری تعریف کو فروغ دینا۔

## 7.7 مزید سیکھنے کے روڈ میپس
فزیکل AI اور ہیومنائڈ روبوٹکس میں آپ کا سفر ابھی شروع ہوا ہے! مسلسل سیکھنے کے لیے ان راستوں پر غور کریں:
- **جدید روبوٹکس کورسز**: خصوصی موضوعات جیسے آپٹیمل کنٹرول، ہول-باڈی ڈائنامکس، انسانی-روبوٹ تعاون، اور اخلاقی AI ڈیزائن دریافت کریں۔
- **تحقیقی شعبے**: جدید ترین شعبوں جیسے ٹیکٹائل سینسنگ، کمپلائنٹ روبوٹکس، بائیو انسپائرڈ روبوٹکس، اور پیچیدہ ہیرا پھیری کے لیے جدید کمک سیکھنے میں گہرائی میں جائیں۔
- **روبوٹکس مقابلے**: روبو کپ، ڈارپا روبوٹکس چیلنج، یا مقامی یونیورسٹی روبوٹکس مقابلوں جیسے چیلنجوں میں حصہ لیں تاکہ مسابقتی، ٹیم پر مبنی ماحول میں اپنی صلاحیتوں کی جانچ کریں۔
- **اوپن سورس پروجیکٹس**: موجودہ اوپن سورس روبوٹکس پروجیکٹس (جیسے، ROS، گیزیبو) میں حصہ ڈالیں یا اپنا پروجیکٹ شروع کریں۔
- **کمیونٹی کی شمولیت**: روبوٹکس فورمز میں شامل ہوں، ورکشاپس میں شرکت کریں، اور اس شعبے کے دیگر شوقین افراد اور پیشہ ور افراد سے رابطہ قائم کریں۔

فزیکل AI اور ہیومنائڈ روبوٹکس کا مستقبل روشن ہے اور آپ جیسے جدید ذہنوں کے منتظر حل نہ ہونے والے مسائل سے بھرا ہوا ہے۔ آگے بڑھو اور مستقبل کی تعمیر کرو!
