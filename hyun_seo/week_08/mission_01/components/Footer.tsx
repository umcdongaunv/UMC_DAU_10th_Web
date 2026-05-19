import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="bg-black shadow-md w-full z-10">
      <div className="container mx-auto text-center text-gray-700">
        <p>&copy; {new Date().getFullYear()} My Web. All rights reserved.</p>
        <div className={"flex justify-center space-x-4 mt-1"}>
          <Link to={"#"}>Privacy Policy</Link>
          <Link to={"#"}>Terms of Service</Link>
          <Link to={"#"}>Contact Us</Link>
        </div>
      </div>
    </footer>
  )
}
