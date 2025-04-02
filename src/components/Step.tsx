import line from '../assets/svg/line.svg'

export type Step = {
    title: string
    description: string
    index: number
}
export type StepProps = {
    steps: Step[]
    current: number
}



export default function StepWidget(props: StepProps) {

    const aStep = (step: Step) =>
        <div className="d-flex">
            <div className='position-relative' style={{ width: 48, height: 48, background: step.index == props.current ? '#97A5DB' : '#384252', borderRadius: '50%' }}>
                {step.index == props.current && <div className='position-absolute' style={{ width: 36, height: 36, top: 6, left: 6, background: '#3C54B0', borderRadius: '50%' }} />}
                <div className='position-absolute' style={{ top: 8, left: step.index == 0 ? 19 : 17, color: 'white' }} >{step.index + 1}</div>
            </div>
            <div className='px-2'>
                <div style={{ color: step.index == props.current ? '#273672' : '#384252', fontSize: 14, fontWeight: 700 }}>{step.title}</div>
                <div style={{ color: '#242B35', fontSize: 14, fontWeight: 500 }}>{step.description}</div>
            </div>
        </div>
    return (
        <div className="d-flex align-items-center">
            {props.steps.map((step: Step, index: number) => <div className="d-flex">{aStep(step)}{index <= props.steps.length - 2 && <img src={line} width={50} className='px-2' />}</div>)}
        </div>
    )
}