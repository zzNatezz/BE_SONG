function shuffleIndex(array) {
    let arrayLenght = array.length, randomIndex,tempMemo;
    while(arrayLenght > 0){
        randomIndex = Math.floor(Math.random()*arrayLenght--);
        tempMemo = array[arrayLenght];
        array[arrayLenght] = array[randomIndex];
        array[randomIndex] = tempMemo
    }
    return ( array );
}

export default shuffleIndex;

