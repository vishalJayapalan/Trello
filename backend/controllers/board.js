const Board = require('../models/boards')

/*
  route :  /
*/

const getBoards = (req, res) => {
  Board.find({ adminUser: req.user._id })
    .then(board => {
      return res.json(board)
    })
    .catch(err => res.status(400).json('Error: ' + err))
}

const getBoards2 = async (req, res) => {
  const boards = await Board.find()
  const teamBoards = []
  boards.forEach(board => {
    if (board.team.includes(req.user._id)) {
      teamBoards.push(board)
    }
  })
  return res.json(teamBoards)
}

/*
  route :  /
*/

const createBoard = (req, res) => {
  const board = new Board()
  board.boardName = req.body.boardName
  board.adminUser = req.user._id
  board.team.push(req.user._id)
  board
    .save()
    .then(() => res.json({ boardId: board._id }))
    .catch(err => res.status(400).json('Error: ' + err))
}

/*
  route :  /:id
  id is the BoardId
*/

const updateBoard = (req, res) => {
  Board.findById(req.params.id)
    .then(board => {
      board[`${req.body.name}`] = req.body.value
      board
        .save()
        .then(() => res.json('updated'))
        .catch(err => res.json('ERROR: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
}

/*
  route :  /:id
  id is the BoardID
*/

const deleteBoard = (req, res) => {
  Board.findByIdAndDelete(req.params.id)
    .then(() => res.json('deleted Board'))
    .catch(err => res.status(400).json('Error: ' + err))
}

/*
  route: /team/:id
  id is the boardId
*/

const addTeamMember = async (req, res) => {
  const board = await Board.findById(req.params.id)
  board.team.push(req.body.teamMemberId)
  await board.save()
  res.json(board)
}

/*
  route: /team/:id
  id is the boardId
*/
const removeTeamMember = async (req, res) => {
  // console.log(req.body.teamMemberId)
  const board = await Board.findById(req.params.id)
  board.team = board.team.filter(
    teamMemberId => teamMemberId != req.body.teamMemberId
  )
  await board.save()
  res.json(board)
}

module.exports = {
  getBoards,
  getBoards2,
  createBoard,
  deleteBoard,
  updateBoard,
  addTeamMember,
  removeTeamMember
}
