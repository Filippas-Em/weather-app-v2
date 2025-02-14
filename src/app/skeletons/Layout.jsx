import CardInputs from "../components/CardInputs"
import Content from "../components/Content"

export default function Layout({ children }){
    return (
        <div className='mainCard'>
            <div className="controls">
                <CardInputs />

            </div>
            <div className="card-info">
                <Content />
            </div>
        </div>
    )
}