import React from "react";
import { Modal, Button } from "react-bootstrap";

const defBoard = [
  "♜b",
  "♞b",
  "♝b",
  "♛b",
  "♚b",
  "♝b",
  "♞b",
  "♜b",
  "♙b",
  "♙b",
  "♙b",
  "♙b",
  "♙b",
  "♙b",
  "♙b",
  "♙b",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "♙w",
  "♙w",
  "♙w",
  "♙w",
  "♙w",
  "♙w",
  "♙w",
  "♙w",
  "♜w",
  "♞w",
  "♝w",
  "♛w",
  "♚w",
  "♝w",
  "♞w",
  "♜w",
];

function ModalReload(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="sm-lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.subTitle}</p>
      </Modal.Body>
      <Modal.Footer>
        {props.type == "reload" ? (
          <>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button
              onClick={() => {
                window.localStorage.setItem("board", defBoard);
                window.localStorage.setItem("currentPlayerColor", "w");
                window.location.reload();
                props.onHide();
              }}
            >
              Yes
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                window.localStorage.setItem("board", defBoard);
                window.localStorage.setItem("currentPlayerColor", "w");
                window.location.reload();
                props.onHide();
              }}
            >
              New Game
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalReload;
