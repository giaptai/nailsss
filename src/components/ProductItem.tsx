import demo1 from '../assets/images/demo1.png'
export type ProductModel = {
    name: string
    code: string
    desc: string
    price: number
}
export type ProductProps = {
    item: ProductModel
}

export default function ProductItem(props: ProductProps) {
    return (
        <div className='d-flex p-2 rounded' style={{ border: '1px solid #F1F3F6', backgroundColor: '#FCFCFD' }}>
            <img src={demo1} className="rounded" style={{ width: '124px', height: '124px', marginRight: 8 }} />
            <div className='column h-100'>
                <div style={{ fontSize: 20, color: "#242B35", lineHeight: '24px', fontWeight: 700, paddingTop: 5 }}>{props.item.name}</div>
                <div style={{ fontSize: 16, color: '#242B35', lineHeight: '24px' }}>{props.item.code}</div>
                <div style={{ fontSize: 16, color: '#5B6B86', lineHeight: '24px' }}>{props.item.desc}</div>
                <div style={{ fontSize: 18, color: '#E95A54', lineHeight: '24px', fontWeight: 700, paddingTop: 12 }}>{props.item.price.toLocaleString()}Đ</div>
            </div>
        </div>
    )
}