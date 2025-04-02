import wtcLogo from "../assets/images/logo.png"
export default function SplashScreen() {
  return (
    <div className='position-relative' style={{width:"100vw",height:"100vh"}}>
      <img src={wtcLogo} className='position-absolute top-50 start-50 translate-middle' style={{width:288}}  alt="Loading..."/>
    </div>
  )
}
