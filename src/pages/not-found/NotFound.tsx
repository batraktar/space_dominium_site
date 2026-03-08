import AffixedMenuShell from '../../shared/layout/AffixedMenuShell'
import RobotScene from '../../shared/three/RobotScene'
import styles from './not-found.module.scss'

function NotFound() {
  return (
    <AffixedMenuShell
      burgerColor="var(--indigo)"
      contactButtonBg="var(--indigo)"
      contactButtonTextColor="#fff"
      fixedPosition="bottom"
      alwaysFixed
    >
      <div className={styles.page}>
        <div className={styles.robot}>
        <RobotScene
          modelUrl="/models/robot/Robot-wd.glb"
          modelScale={1.4}
          modelYOffset={0.1}
          cameraPosition={[0, 0.35, 2.1]}
          autoRotate={false}
          enableMouseYaw={false}
          walkOnCard
          hiddenNodeNames={['Eye_L', 'Eye_R']}
          partColors={{
            Head: '#F0F0F0',
            Body: '#F0F0F0',
            Glass: '#CBD83B',
            Power_Pack: '#454545',
            Neck: '#333333',
            Neck_Joint_Ring: '#CBD83B',
            Eye_L: '#A88AED',
            Eye_R: '#A88AED',
            Ear_L: '#CBD83B',
            Ear_R: '#CBD83B',
            Radiator_L: '#A88AED',
            Radiator_R: '#A88AED',
            Shoulder_L: '#454545',
            Shoulder_R: '#454545',
            Shoulder_Armor_L: '#F0F0F0',
            Shoulder_Armor_R: '#F0F0F0',
            Shoulder_Ring_L: '#CBD83B',
            Shoulder_Ring_R: '#CBD83B',
            Forearm_L: '#FFFFFF',
            Forearm_R: '#FFFFFF',
            Elbow_L: '#333333',
            Elbow_R: '#333333',
            Elbow_Armor_L: '#F0F0F0',
            Elbow_Armor_R: '#F0F0F0',
            Elbow_Ring_L: '#A88AED',
            Elbow_Ring_R: '#A88AED',
            Wrist_L: '#454545',
            Wrist_R: '#454545',
            Wrist_Ring_L: '#CBD83B',
            Wrist_Ring_R: '#CBD83B',
            Finger_Inner_L: '#F0F0F0',
            Finger_Middle_L: '#F0F0F0',
            Finger_Outer_L: '#FFFFFF',
            Finger_Inner_Joint_L: '#454545',
            Finger_Middle_Joint_L: '#454545',
            Finger_Outer_Joint_L: '#454545',
            Finger_Outer_Joint_L_1: '#454545',
            Finger_Inner_R: '#F0F0F0',
            Finger_Middle_R: '#F0F0F0',
            Finger_Inner_Joint_R: '#454545',
            Finger_Middle_Joint_R: '#454545',
            Finger_Outer_Joint_R: '#454545',
            'Finger_Outer_Joint_R.001': '#454545',
            Finger_Outer_Joint_R001: '#454545',
            Finger_Outer_Joint_R_1: '#454545',
            ERROR_404: '#A88AED',
          }}
        />
        </div>
        <div className={styles.text}>
          Сторінку не знайдено. Перевір адресу або повернись на головну.
        </div>
      </div>
    </AffixedMenuShell>
  )
}

export default NotFound
