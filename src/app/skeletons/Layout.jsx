import CardInputs from "../components/CardInputs"

export default function Layout({ children }){
    return (
        <div className='mainCard'>
            <CardInputs />
            <div className="card-info">
                {children}
            </div>
        </div>
    )
}