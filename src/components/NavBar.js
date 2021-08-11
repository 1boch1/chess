import React, { useState } from "react";

import { Navbar, Container, Button } from "react-bootstrap";
import Modal from "./ModalReload";
import "bootstrap/dist/css/bootstrap.min.css";

import classes from "./NavBar.module.css";

function NavBar() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" className={classes.nb}>
        <Container className={classes.containernb}>
          <Navbar.Brand href="">
            <span className={classes.logo}>&#9822;</span>
            <span className={classes.logotxt}>
              {" "}
              <b>Chess</b>
            </span>
          </Navbar.Brand>
        </Container>
        <Navbar.Text className={classes.reload}>
          <Button
            variant="dark"
            className={classes.buttonReload}
            onClick={() => {
              setModalShow(() => true);
            }}
          >
            ↺
          </Button>
        </Navbar.Text>
      </Navbar>

      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        title="Restart"
        subTitle="Are you sure you want to restart the game?"
        type="reload"
      />
    </>
  );
}

export default NavBar;
