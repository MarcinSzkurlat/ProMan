import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {initDropdown} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        const statuses = await dataHandler.getStatuses();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board, statuses);
            const content = boardBuilder(board, statuses);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.board-remove[data-board-id="${board.id}"]`,
                "click",
                deleteBoardButtonHandler
            );
            domManager.addEventListener(
                `.board-toggle[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `#board-title_${board.id}`,
                'click',
                renameBoard
            );
        }
        initDropdown();
    },
    creatingNewBoard: async function () {
        await newBoardButtonCreation('public')
        await newBoardButtonCreation('private')
    },
    modifyingColumns: function () {
        const boardsColumnsContainers = document.querySelectorAll('.board-column-content');
        boardsColumnsContainers.forEach((element) => {
            element.addEventListener('drop', (event) => {
                event.preventDefault()
                const cardId = localStorage.getItem('dragged-item')
                const card = document.querySelector(`.card[data-card-id="${cardId}"]`)
                if (card.classList.contains("card")) {
                    element.appendChild(card)
                }
            });
            element.addEventListener('dragover', (event) => {
                event.preventDefault()
            })
        })
    }
};

async function newBoardButtonCreation(type){
    const newBoardBtn = document.querySelector(`#new-${type}-board-btn`);
    const newBoardContainer = document.querySelector(`#new-${type}-board-input-container`);
    const newBoardSaveBtn = document.querySelector(`#save-new-${type}-board`);
    toggleBoardNameInput(newBoardBtn, newBoardContainer)
    await createBoardButtonEvent(newBoardSaveBtn, document.querySelector(`#new-${type}-board-input`), type)
}
function toggleBoardNameInput(boardBtn, BoardContainer){
    boardBtn.addEventListener('click', () => {
            let newBoardContainerVisibility = BoardContainer.style.display;
            if (newBoardContainerVisibility === "block"){
                BoardContainer.style.display = "none"
            } else {
                BoardContainer.style.display = "block"
            }
        });
}
async function createBoardButtonEvent(BoardSaveBtn, boardName, type){
    BoardSaveBtn.addEventListener('click', () => {
            if (boardName.value) {
                dataHandler.createNewBoard(boardName.value, type)
                reloadBoardsAndCards()
            }
        })
}

function showHideButtonHandler(clickEvent) {
    clickEvent.target.classList.toggle("flip");
    const boardId = checkChildren(clickEvent.target);
    let board = document.getElementById(boardId);
    if (board.classList.contains("hide-board")) {
        cardsManager.loadCards(boardId);
        board.classList.remove("hide-board");

    }
    else {
        cardsManager.deleteCards(boardId);
        board.classList.add("hide-board");
    }
}

function checkChildren(target) {
    if (target.children.length > 0){
        return target.dataset.boardId;
    } else {
        return target.parentElement.dataset.boardId;
    }
}

function renameBoard (board) {
    const titleId = board.target.dataset['boardTitleId'];
    let text = board.target.innerText;
    const boardId = board.target.id;
    board.target.outerHTML = `<input class="board-title" id="input-${boardId}" data-board-title-id="${titleId}" value="${text}">`
    const input = document.querySelector(`#input-${boardId}`)
    input.addEventListener('keyup', function test(event) {
        if (event.code === "Enter" ) {
            const inputText = event.target.value;
            event.target.outerHTML = `<span class="board-title" id="${boardId}">${inputText}</span>`
            const boardTitle = document.querySelector(`#${boardId}`);
            dataHandler.renameBoard(titleId, inputText);
            boardTitle.addEventListener('click', renameBoard);
        } else if (event.code === "Escape") {
            event.target.outerHTML = `<span class="board-title" id="${boardId}" data-board-title-id="${titleId}">${text}</span>`
            const boardTitle = document.querySelector(`#${boardId}`);
            boardTitle.addEventListener('click', renameBoard);
        }
    })
}

async function deleteBoardButtonHandler(clickEvent) {
    const board = clickEvent.target;
    io.connect('http://localhost:5000/').emit('delete board', board.dataset.boardId);
}
export async function removeBoard(boardId){
    const board = document.querySelector(`[data-board-id="${boardId}"]`)
    console.log(board, boardId)
    board.parentElement.remove();
    await dataHandler.deleteBoard(boardId);
}

export async function reloadBoardsAndCards(){
    await document.querySelectorAll('.board-container').forEach(board => board.innerHTML = '')
    boardsManager.loadBoards().then(boardsManager.modifyingColumns);
}