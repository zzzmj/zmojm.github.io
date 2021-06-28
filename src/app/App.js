import Button from '../components/Button/Button'
import Header from '../feature/Header/Header'
import SideBar from '../feature/SideBar/SideBar'
import Annotation from '../feature/Annotation/Annotation'
import './App.scss'

function App() {
    const handleClick = () => {
        console.log('说实话，真的不太习惯')
    }

    return (
        <div className="App">
            <Header />
            <div className="main">
                <SideBar />
                <Annotation />
            </div>


        </div>
    )
}

export default App
