import axios from "../api/axiosInstance"

export default function Home() {
  const fetchData = async () => {
    const res = await axios.get("/user/profile")
    console.log(res.data)
  }

  return <button onClick={fetchData}>API 호출</button>
}