import React, { useState, useEffect } from "react";
import classes from "./Board.module.css";

import Modal from "./ModalReload";

String.prototype.piece = function () {
  return this.toString().substring(0, 1);
};

String.prototype.color = function () {
  return this.toString().substring(1, 2);
};

//Variable to remember the player that have to move

var currentPlayerColor = "w";
var nextPlayerColor = "b";

var redBox = "";

//Pieces and Board

var pawn = "♙";
var knight = "♞";
var bishop = "♝";
var queen = "♛";
var king = "♚";
var tower = "♜";

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

//Board border

var leftBorder = [0, 8, 16, 24, 32, 40, 48, 56];
var rightBorder = [7, 15, 23, 31, 39, 47, 55, 63];

function Board() {
  const [board, setBoard] = useState(defBoard);

  const [modalShow, setModalShow] = useState(false);

  //Load the last game on mount (for example after a refresh)

  useEffect(() => {
    if (window.localStorage.getItem("board")) {
      setBoard(() => window.localStorage.getItem("board").split(","));
    }

    if (window.localStorage.getItem("currentPlayerColor")) {
      currentPlayerColor = window.localStorage.getItem("currentPlayerColor");
      nextPlayerColor = currentPlayerColor == "w" ? "b" : "w";
    }
  }, []);

  var highlightedPositions = [];
  var possibleMoves = [];

  var lastClicked = board.indexOf("");

  //Function to verify if the king of the specified color is
  //in checkmate,

  //(board to examine, color of the king): boolean

  //the board is passed as a parameter because this function
  //is used to check temporary boards as well.

  function checkMate(board, color) {
    let kingIdx = board.indexOf("♚" + color);

    let moves = [];

    //Check if there is an enemy piece that can eat
    //our king

    for (let i in board) {
      if (board[i] != "" && board[i].color() != color) {
        moves = pieceMovements(board[i], i, board);

        if (moves.includes(kingIdx)) return true;
      }
    }

    return false;
  }

  //Function that returns the possible moves that a piece
  //can do, this function doesn't take in consideration if a move
  //creates a checkmate

  //(selected piece, index of that piece, board to examine): possible moves

  //the board is passed as a parameter because this function
  //is used to check temporary boards as well.

  function pieceMovements(selected, idx, board_) {
    if (!board_) board_ = board;

    let index = Number(idx);
    let moves = [];

    let piece = selected.piece();
    let color = selected.color();

    let newIndex = -1;

    //Pawn current player
    if (piece == "♙" && color == "w") {
      if (index - 8 >= 0 && board_[index - 8] == "") {
        moves.push(index - 8);

        if (index >= 48 && index <= 55 && board_[index - 16] == "") {
          moves.push(index - 16);
        }
      }

      if (
        index - 8 + 1 >= 0 &&
        !rightBorder.includes(index) &&
        board_[index - 8 + 1] != "" &&
        board_[index - 8 + 1].color() != color
      )
        moves.push(index - 8 + 1);

      if (
        index - 8 - 1 >= 0 &&
        !leftBorder.includes(index) &&
        board_[index - 8 - 1] != "" &&
        board_[index - 8 - 1].color() != color
      )
        moves.push(index - 8 - 1);
    }

    //Pawn next player
    if (piece == "♙" && color == "b") {
      if (index + 8 <= 63 && board_[index + 8] == "") {
        moves.push(index + 8);

        if (index >= 8 && index <= 15 && board_[index + 16] == "") {
          moves.push(index + 16);
        }
      }

      newIndex = index + 8 - 1;

      if (
        newIndex <= 63 &&
        !leftBorder.includes(index) &&
        board_[newIndex] != "" &&
        board_[newIndex].color() != color
      )
        moves.push(newIndex);

      newIndex = index + 8 + 1;

      if (
        newIndex <= 63 &&
        !rightBorder.includes(index) &&
        board_[newIndex] != "" &&
        board_[newIndex].color() != color
      )
        moves.push(newIndex);
    }

    //Tower
    else if (piece == "♜") {
      for (let i = index - 8; i >= 0; i -= 8) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      for (let i = index + 8; i <= 63; i += 8) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      for (let i = index + 1; i <= 7 - (index % 8) + index; i++) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      for (let i = index - 1; i >= index - (index % 8); i--) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }
    }

    //Knight
    else if (piece == "♞") {
      //Top-Right

      newIndex = index - 16 + 1;

      if (
        (index - 7) % 8 != 0 &&
        newIndex >= 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }

      //Top-Left

      newIndex = index - 16 - 1;

      if (
        index % 8 != 0 &&
        newIndex >= 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }

      //Bottom-Right

      newIndex = index + 16 + 1;

      if (
        (index - 7) % 8 != 0 &&
        newIndex <= 63 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }

      //Bottom-Left

      newIndex = index + 16 - 1;

      if (
        index % 8 != 0 &&
        newIndex <= 63 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }

      //Right-Top

      newIndex = index - 8 + 2;

      if (
        (index - 7) % 8 != 0 &&
        (index - 6) % 8 != 0 &&
        newIndex >= 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }

      //Right-Bottom

      newIndex = index + 8 + 2;

      if (
        (index - 7) % 8 != 0 &&
        (index - 6) % 8 != 0 &&
        newIndex <= 63 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }

      //Left-Down

      newIndex = index + 8 - 2;

      if (
        index % 8 != 0 &&
        (index - 1) % 8 != 0 &&
        newIndex <= 63 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }

      //Left-Up

      newIndex = index - 8 - 2;

      if (
        index % 8 != 0 &&
        (index - 1) % 8 != 0 &&
        newIndex >= 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      ) {
        moves.push(newIndex);
      }
    }

    //Bishop
    else if (piece == "♝") {
      //Top-Left

      newIndex = index - 8 - 1;

      for (let i = newIndex; i >= 0 && index % 8 != 0; i -= 9) {
        if (i % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      //Top-Right

      newIndex = index - 8 + 1;

      for (let i = newIndex; i >= 0 && (index - 7) % 8 != 0; i -= 7) {
        if ((i - 7) % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      //Bottom-Left

      newIndex = index + 8 - 1;

      for (let i = newIndex; i <= 63 && index % 8 != 0; i += 7) {
        if (i % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      //Bottom-Right

      newIndex = index + 8 + 1;

      for (let i = newIndex; i <= 63 && (index - 7) % 8 != 0; i += 9) {
        if ((i - 7) % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }
    }

    //Queen
    else if (piece == "♛") {
      //moves.push(...pieceMovements("♝" + color.toString(), index, board_));
      //moves.push(...pieceMovements("♜" + color.toString(), index, board_));

      for (let i = index - 8; i >= 0; i -= 8) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      for (let i = index + 8; i <= 63; i += 8) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      for (let i = index + 1; i <= 7 - (index % 8) + index; i++) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      for (let i = index - 1; i >= index - (index % 8); i--) {
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      //Top-Left

      newIndex = index - 8 - 1;

      for (let i = newIndex; i >= 0 && index % 8 != 0; i -= 9) {
        if (i % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      //Top-Right

      newIndex = index - 8 + 1;

      for (let i = newIndex; i >= 0 && (index - 7) % 8 != 0; i -= 7) {
        if ((i - 7) % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      //Bottom-Left

      newIndex = index + 8 - 1;

      for (let i = newIndex; i <= 63 && index % 8 != 0; i += 7) {
        if (i % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }

      //Bottom-Right

      newIndex = index + 8 + 1;

      for (let i = newIndex; i <= 63 && (index - 7) % 8 != 0; i += 9) {
        if ((i - 7) % 8 == 0) {
          if (board_[i].color() != color) moves.push(i);
          break;
        }
        if (board_[i] == "") moves.push(i);
        else if (board_[i].color() == color) break;
        else if (board_[i].color() != color) {
          moves.push(i);
          break;
        }
      }
    }

    //King
    else if (piece == "♚") {
      newIndex = index - 8;

      if (
        newIndex >= 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);

      newIndex = index + 8;

      if (
        newIndex <= 63 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);

      newIndex = index + 1;

      if (
        newIndex <= 63 &&
        (index - 7) % 8 != 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);

      newIndex = index - 1;

      if (
        newIndex >= 0 &&
        index % 8 != 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);

      newIndex = index + 8 + 1;

      if (
        newIndex <= 63 &&
        (index - 7) % 8 != 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);

      newIndex = index + 8 - 1;

      if (
        newIndex <= 63 &&
        index % 8 != 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);

      newIndex = index - 8 + 1;

      if (
        newIndex >= 0 &&
        (index - 7) % 8 != 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);

      newIndex = index - 8 - 1;

      if (
        newIndex >= 0 &&
        index % 8 != 0 &&
        (board_[newIndex] == "" || board_[newIndex].color() != color)
      )
        moves.push(newIndex);
    }

    return moves;
  }

  //Function that remove from the array of the legalMoves, all that
  //moves that would make you lose the game.
  //input: legal moves and the index of the piece taken in consideration
  //output: legal moves - suicide moves

  function cantCommitSuicide(moves, idx) {
    let tempBoard = [];
    let legalMoves = [];

    for (let i in moves) {
      tempBoard = [...board];

      //Make a move in the temp board

      tempBoard[moves[i]] = tempBoard[idx];
      tempBoard[idx] = "";

      if (!checkMate(tempBoard, currentPlayerColor)) legalMoves.push(moves[i]);
    }

    return legalMoves;
  }

  //Function to compute the legal moves that a piece can do,
  //this function removes from the possible moves that ones which
  //would make you immediately lose

  function legalMoves(selected, idx) {
    let moves = pieceMovements(selected, idx);

    moves = cantCommitSuicide(moves, idx);

    return moves;
  }

  //Decide if there is a winner (when the board change)

  useEffect(() => {
    if (redBox != "") document.getElementById(redBox).style.boxShadow = "";

    if (checkMate(board, currentPlayerColor)) {
      document.getElementById(
        board.indexOf("♚" + currentPlayerColor)
      ).style.boxShadow = "rgb(255 11 11 / 39%) 0px 0px 0px 1000px inset";

      redBox = board.indexOf("♚" + currentPlayerColor);

      if (getAllPossibleMoves(currentPlayerColor, board).length == 0) {
        setModalShow(() => true);
      }
    }
  }, board);

  function highlightPossibleMoves(moves) {
    endhighlightPossibleMoves();

    for (let i in moves) {
      highlightedPositions.push("square" + moves[i].toString());

      document.getElementById("square" + moves[i].toString()).style.boxShadow =
        "rgb(43 255 105 / 21%) 0px 0px 0px 1000px inset";
    }
  }

  function endhighlightPossibleMoves() {
    for (let i in highlightedPositions) {
      document.getElementById(highlightedPositions[i]).style.boxShadow = "";
    }

    highlightedPositions = [];
  }

  //Function that moves a piece on the board

  function movePiece(start, end) {
    if (start == end) return;

    let temp = [...board];

    temp[end] = temp[start];
    temp[start] = "";

    setBoard(() => temp);

    window.localStorage.setItem("board", temp.toString());
  }

  function getAllPossibleMoves(color, board) {
    let res = [];

    for (let i in board) {
      if (board[i].color() == color) {
        console.log(board[i], legalMoves(board[i], i));
        res = [...res, ...legalMoves(board[i], i)];
      }
    }

    return res;
  }

  //Click handler

  function handlePieceClick(e) {
    let clickedNow = Number(e.target.id);

    //If you can't move where you clicked or if you are trying to move a piece
    //of the other player, the function will immediately return

    if (
      board[clickedNow].color() == nextPlayerColor &&
      (board[lastClicked] == "" ||
        board[lastClicked].color() == nextPlayerColor ||
        !possibleMoves.includes(clickedNow))
    ) {
      return;
    }

    //If the piece can be moved

    if (board[lastClicked] != "" && possibleMoves.includes(clickedNow)) {
      movePiece(lastClicked, clickedNow);

      [currentPlayerColor, nextPlayerColor] = [
        nextPlayerColor,
        currentPlayerColor,
      ];

      window.localStorage.setItem("currentPlayerColor", currentPlayerColor);

      endhighlightPossibleMoves();
      lastClicked = clickedNow;

      return;
    }

    //If the piece can't be moved

    possibleMoves = legalMoves(board[clickedNow], clickedNow);
    highlightPossibleMoves(possibleMoves);

    lastClicked = clickedNow;
  }

  return (
    <>
      <div className={classes.square}>
        {[...Array(64)].map((x, i) => {
          return (
            <div
              className={
                (i + Math.floor(i / 8)) % 2 == 0 ? classes.light : classes.dark
              }
              id={"square" + i}
              key={i}
            >
              <span
                className={classes.piece}
                id={i}
                style={
                  board[i].color() == "b"
                    ? {
                        color: "black",
                        WebkitTextStroke: "0.013vw rgb(219, 219, 219)",
                      }
                    : {
                        color: "rgb(226, 226, 226)",
                        WebkitTextStroke: "0.058vw black",
                      }
                }
                onClick={(e) => handlePieceClick(e)}
              >
                {board[i].piece()}
              </span>
            </div>
          );
        })}
      </div>
      <span className={classes.turn}>
        {currentPlayerColor == "w" ? "WHITE" : "BLACK"} TURN
      </span>
      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        title={(nextPlayerColor == "w" ? "White" : "Black") + " won the game!"}
        subTitle={
          "Congratulations to " + (nextPlayerColor == "w" ? "White!" : "Black!")
        }
        type="win"
      />
    </>
  );
}

export default Board;
