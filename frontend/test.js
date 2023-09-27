const sleep = (val) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(val++);
        resolve(val);
      }, 1000);
    });
  };
  
  const init = async () => {
    let val = await sleep(0);
    console.log(9)
    val = await sleep(val);
    val = await sleep(val);
    val = await sleep(val);
    val = await sleep(val);
    val = await sleep(val);
  };
  
  init().then(() => console.log("sssss"));