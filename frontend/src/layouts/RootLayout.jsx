import { Sidebar } from "../components/Sidebar"
import { Outlet } from "react-router-dom"

function RootLayout(){
    return (
        <>
            <Sidebar/>
            <div className="ml-17">
                <Outlet/>  
            </div>
        </>
    )
}

export default RootLayout