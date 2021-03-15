import {
  FC,
  useState,
  useEffect,
  memo,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from 'react'
import { Modal } from 'antd'
import { SmileTwoTone } from '@ant-design/icons'
import { Button } from 'antd'
import { IconListWra, IconItemWra } from './style'
import { getAntdIconByIconStr } from '../../utils/menu'
import { formDrawerContext } from './context'

/** 网站 icon */
const browserIcons = [
  'AccountBookOutlined',
  'AimOutlined',
  'AlertOutlined',
  'ApartmentOutlined',
  'ApiOutlined',
  'AppstoreAddOutlined',
  'AppstoreOutlined',
  'AudioOutlined',
  'AudioMutedOutlined',
  'AuditOutlined',
  'BankOutlined',
  'BarcodeOutlined',
  'BarsOutlined',
  'BellOutlined',
  'BlockOutlined',
  'BookOutlined',
  'BorderOutlined',
  'BorderlessTableOutlined',
  'BranchesOutlined',
  'BugOutlined',
  'BuildOutlined',
  'BulbOutlined',
  'CalculatorOutlined',
  'CalendarOutlined',
  'CameraOutlined',
  'CarOutlined',
  'CarryOutOutlined',
  'CiCircleOutlined',
  'CiOutlined',
  'ClearOutlined',
  'CloudDownloadOutlined',
  'CloudOutlined',
  'CloudServerOutlined',
  'CloudSyncOutlined',
  'CloudUploadOutlined',
  'ClusterOutlined',
  'CodeOutlined',
  'CoffeeOutlined',
  'CommentOutlined',
  'CompassOutlined',
  'CompressOutlined',
  'ConsoleSqlOutlined',
  'ContactsOutlined',
  'ContainerOutlined',
  'ControlOutlined',
  'CopyrightOutlined',
  'CreditCardOutlined',
  'CrownOutlined',
  'CustomerServiceOutlined',
  'DashboardOutlined',
  'DatabaseOutlined',
  'DeleteColumnOutlined',
  'DeleteRowOutlined',
  'DeliveredProcedureOutlined',
  'DeploymentUnitOutlined',
  'DesktopOutlined',
  'DingtalkOutlined',
  'DisconnectOutlined',
  'DislikeOutlined',
  'DollarCircleOutlined',
  'DollarOutlined',
  'DownloadOutlined',
  'EllipsisOutlined',
  'EnvironmentOutlined',
  'EuroCircleOutlined',
  'EuroOutlined',
  'ExceptionOutlined',
  'ExpandAltOutlined',
  'ExpandOutlined',
  'ExperimentOutlined',
  'ExportOutlined',
  'EyeOutlined',
  'EyeInvisibleOutlined',
  'FieldBinaryOutlined',
  'FieldNumberOutlined',
  'FieldStringOutlined',
  'FieldTimeOutlined',
  'FileAddOutlined',
  'FileDoneOutlined',
  'FileExcelOutlined',
  'FileExclamationOutlined',
  'FileOutlined',
  'FileGifOutlined',
  'FileImageOutlined',
  'FileJpgOutlined',
  'FileMarkdownOutlined',
  'FilePdfOutlined',
  'FilePptOutlined',
  'FileProtectOutlined',
  'FileSearchOutlined',
  'FileSyncOutlined',
  'FileTextOutlined',
  'FileUnknownOutlined',
  'FileWordOutlined',
  'FileZipOutlined',
  'FilterOutlined',
  'FireOutlined',
  'FlagOutlined',
  'FolderAddOutlined',
  'FolderOutlined',
  'FolderOpenOutlined',
  'FolderViewOutlined',
  'ForkOutlined',
  'FormatPainterOutlined',
  'FrownOutlined',
  'FunctionOutlined',
  'FundProjectionScreenOutlined',
  'FundViewOutlined',
  'FunnelPlotOutlined',
  'GatewayOutlined',
  'GifOutlined',
  'GiftOutlined',
  'GlobalOutlined',
  'GoldOutlined',
  'GroupOutlined',
  'HddOutlined',
  'HeartOutlined',
  'HistoryOutlined',
  'HomeOutlined',
  'HourglassOutlined',
  'IdcardOutlined',
  'ImportOutlined',
  'InboxOutlined',
  'InsertRowAboveOutlined',
  'InsertRowBelowOutlined',
  'InsertRowLeftOutlined',
  'InsertRowRightOutlined',
  'InsuranceOutlined',
  'InteractionOutlined',
  'KeyOutlined',
  'LaptopOutlined',
  'LayoutOutlined',
  'LikeOutlined',
  'LineOutlined',
  'LinkOutlined',
  'Loading3QuartersOutlined',
  'LoadingOutlined',
  'LockOutlined',
  'MacCommandOutlined',
  'MailOutlined',
  'ManOutlined',
  'MedicineBoxOutlined',
  'MehOutlined',
  'MenuOutlined',
  'MergeCellsOutlined',
  'MessageOutlined',
  'MobileOutlined',
  'MoneyCollectOutlined',
  'MonitorOutlined',
  'MoreOutlined',
  'NodeCollapseOutlined',
  'NodeExpandOutlined',
  'NodeIndexOutlined',
  'NotificationOutlined',
  'NumberOutlined',
  'OneToOneOutlined',
  'PaperClipOutlined',
  'PartitionOutlined',
  'PayCircleOutlined',
  'PercentageOutlined',
  'PhoneOutlined',
  'PictureOutlined',
  'PlaySquareOutlined',
  'PoundCircleOutlined',
  'PoundOutlined',
  'PoweroffOutlined',
  'PrinterOutlined',
  'ProfileOutlined',
  'ProjectOutlined',
  'PropertySafetyOutlined',
  'PullRequestOutlined',
  'PushpinOutlined',
  'QrcodeOutlined',
  'ReadOutlined',
  'ReconciliationOutlined',
  'RedEnvelopeOutlined',
  'ReloadOutlined',
  'RestOutlined',
  'RobotOutlined',
  'RocketOutlined',
  'RotateLeftOutlined',
  'RotateRightOutlined',
  'SafetyCertificateOutlined',
  'SafetyOutlined',
  'SaveOutlined',
  'ScanOutlined',
  'ScheduleOutlined',
  'SearchOutlined',
  'SecurityScanOutlined',
  'SelectOutlined',
  'SendOutlined',
  'SettingOutlined',
  'ShakeOutlined',
  'ShareAltOutlined',
  'ShopOutlined',
  'ShoppingCartOutlined',
  'ShoppingOutlined',
  'SisternodeOutlined',
  'SkinOutlined',
  'SmileOutlined',
  'SolutionOutlined',
  'SoundOutlined',
  'SplitCellsOutlined',
  'StarOutlined',
  'SubnodeOutlined',
  'SwitcherOutlined',
  'SyncOutlined',
  'TableOutlined',
  'TabletOutlined',
  'TagOutlined',
  'TagsOutlined',
  'TeamOutlined',
  'ThunderboltOutlined',
  'ToTopOutlined',
  'ToolOutlined',
  'TrademarkCircleOutlined',
  'TrademarkOutlined',
  'TransactionOutlined',
  'TranslationOutlined',
  'TrophyOutlined',
  'UngroupOutlined',
  'UnlockOutlined',
  'UploadOutlined',
  'UsbOutlined',
  'UserAddOutlined',
  'UserDeleteOutlined',
  'UserOutlined',
  'UserSwitchOutlined',
  'UsergroupAddOutlined',
  'UsergroupDeleteOutlined',
  'VerifiedOutlined',
  'VideoCameraAddOutlined',
  'VideoCameraOutlined',
  'WalletOutlined',
  'WhatsAppOutlined',
  'WifiOutlined',
  'WomanOutlined',
]

let icons: any[] | null = null

interface IconLibraryProps {
  /** 图标库是否展示 */
  isShow: boolean

  /** 切换展示 */
  toggle: () => void

  /** 点击图标的回调 */
  onPress: (icon: any) => void
}

const IconLibrary: FC<IconLibraryProps> = memo(props => {
  const { isShow, onPress, toggle } = props

  const icons = useMemo(() => {
    return browserIcons.map(iconKey => {
      return (
        <IconItemWra key={iconKey} onClick={() => onPress(iconKey)}>
          {getAntdIconByIconStr(iconKey)}
        </IconItemWra>
      )
    })
  }, [])

  return (
    <Modal
      title="点击图标即可选择"
      centered
      visible={isShow}
      footer={null}
      onCancel={toggle}
      mask={false}
    >
      <IconListWra>{icons}</IconListWra>
    </Modal>
  )
})

export interface FormSelectIconProps {
  iconPath?: string

  // setIconPath: (iconPath: string) => void
  setIconPath: any
}

const FormSelectIcon: FC<FormSelectIconProps> = memo(props => {
  const { iconPath, setIconPath } = props

  const { closeFlag } = useContext(formDrawerContext)

  const [icon, setIcon] = useState<string | undefined>(iconPath)

  const [isShow, setShow] = useState(false)

  /** 第一次动态更新问题 */
  let firstRender = useRef(true)

  const handleClickIcon = useCallback((iconKey: string) => {
    setIcon(iconKey)
    setIconPath(iconKey)
    setShow(false)
  }, [])

  const toggleShow = useCallback(() => setShow(s => !s), [])

  /** 实时和外面的匹配 */
  useEffect(() => setIcon(iconPath), [iconPath])

  /** 监听 drawer关闭的稍后， 设置icon为空 */
  useEffect(() => {
    /** 动态更新的生活，第一次渲染，我们就没必要因为关闭弹框去设置值了 */
    if (firstRender.current) return
    setIcon(undefined)
  }, [closeFlag, firstRender])

  useEffect(() => {
    firstRender.current = false
  }, [])

  const btnIcon = useMemo(() => {
    return icon ? getAntdIconByIconStr(icon) : <SmileTwoTone />
  }, [icon])

  return (
    <div>
      <Button icon={btnIcon} block onClick={toggleShow}>
        {icon ? '修改图标' : '添加图标'}
      </Button>

      <IconLibrary
        isShow={isShow}
        toggle={toggleShow}
        onPress={handleClickIcon}
      />
    </div>
  )
})

export default FormSelectIcon
