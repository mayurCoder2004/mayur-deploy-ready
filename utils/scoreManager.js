let score = 100;

function deduct(points) {
    score -= points;
}

function getScore() {
    return score;
}

module.exports = {
    deduct,
    getScore
};