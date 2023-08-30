class BoggleGame {
    constructor(boardId, secs = 60) {
        this.words = new Set();
        this.board = $("#" + boardId);

        this.secs = secs;
        this.showTimer();
        this.timer = setInterval(this.tick.bind(this), 1000);

        this.score = 0;
        
        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    showMessage(msg) {
        $(".msg", this.board).text(msg);
    }
    
    showScore() {
        $(".score", this.board).text(this.score);
    }

    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    /* handle submit button */
    async handleSubmit(evt) {
        evt.preventDefault();
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word) return;

        if (this.words.has(word)) {
            this.showMessage(`Already found ${word}`);
            return;
        }

        const resp = await axios.get("/check-word", { params: { word: word }});

        if (resp.data.result === "not-word") {
            this.showMessage(`${word} is not valid`);
        } else if (resp.data.result === "not-on-board") {
            this.showMessage(`${word} is not valid word on this board`);
        } else {
            this.words.add(word);
            this.score += word.length;
            this.showMessage(`Added: ${word}`);
            this.showScore();
        }

        $word.val("").focus();
    }

    async tick() {
        this.secs -= 1;
        this.showTimer();
    
        if (this.secs === 0) {
          clearInterval(this.timer);
          await this.scoreGame();
        }
    }

    async scoreGame() {
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
          this.showMessage(`New record: ${this.score}`, "ok");
        } else {
          this.showMessage(`Final score: ${this.score}`, "ok");
        }
      }

}