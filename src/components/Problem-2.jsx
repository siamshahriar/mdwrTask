import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const Problem2 = () => {
  const [show, setShow] = useState(false);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const target = useRef(null); // Initialize the target ref
  const [type, setType] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getPosts = async () => {
    setLoading(true);
    let res;
    if (type === "all") {
      res = await fetch(
        `https://contact.mediusware.com/api/contacts/?page=${page}&page_size=20`
      );
    } else {
      res = await fetch(
        `https://contact.mediusware.com/api/country-contacts/United%20States/?page=${page}&page_size=15`
      );
    }
    if (res.ok) {
      const data = await res.json();
      setContacts((prevContacts) => [...prevContacts, ...data.results]);
      setLoading(false);
      setPage((prevPage) => prevPage + 1);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use Intersection Observer to detect when the loader is visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0 && entries[0].isIntersecting && !loading) {
          getPosts();
        }
      },
      { threshold: 1 }
    );

    if (target.current) {
      observer.observe(target.current);
    }
    console.log({ current: target.current });

    // Cleanup the observer on component unmount
    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      } else if (page === 1) {
        getPosts();
      }
    };
  }, [page, loading, type]);

  console.log({ target });
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <Button className="btn btn-lg btn-primary" onClick={handleShow}>
            All Contacts
          </Button>

          <Modal show={show} onHide={handleClose} scrollable>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Woohoo, you are reading this text in a modal!
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Number</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 &&
                    contacts.map((each, index) => (
                      <tr key={index}>
                        <td>{each.id}</td>
                        <td>{each.phone}</td>
                        <td>{each.country.name}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <div
                ref={target}
                style={{
                  height: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                }}
              >
                {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={() => {
              setType("us");
              handleShow();
            }}
          >
            US Contacts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Problem2;
