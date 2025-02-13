import CardInputs from "../components/CardInputs"

export default function Layout({ children }){
    return (
        <div className='mainCard'>
            <div className="controls">
                            <CardInputs />

            </div>
            <div className="card-info">
                {children}
            </div>
        </div>
    )
}