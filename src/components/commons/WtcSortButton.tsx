import sortIcon from '../../assets/svg/sort.svg'
import WtcButton from './WtcButton'
export type WtcSortButtonProps = {
    label: string
    onClick: () => void
}
export default function WtcSortButton(props: WtcSortButtonProps) {
    return <WtcButton className="wtc-bg-white text-blue" labelStyle={{ fontWeight: 'normal' }}
        label={props.label} iconImage={sortIcon} height={45} fontSize={16} onClick={props.onClick} />
}