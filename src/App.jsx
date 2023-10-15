import { Routes, Route } from "react-router-dom";
import Problem1 from "./components/Problem-1.jsx";
import Menu from "./components/Menu.jsx";
import Problem2 from "./components/Problem-2.jsx";
import Index from "./components/Index.jsx";
import { useEffect, useState } from "react";

function App() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      const res = await fetch(
        `https://contact.mediusware.com/api/contacts/?page=1&page_size=20`
      );
      if (res.ok) {
        const data = await res.json();
        setContacts((prevContacts) => [...prevContacts, ...data.results]);
      }
    };
    getPosts();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/" element={<Menu />}>
          <Route path="problem-1" element={<Problem1 />} />
          <Route
            path="problem-2"
            element={<Problem2 initialContacts={contacts} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
