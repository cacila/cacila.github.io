window.addEventListener('load', () => {
	const MineList = [];
	const [, p1, p2, p3] = document.querySelectorAll('p');
	const liList = [...document.querySelectorAll('li')];
	const aroundCount = function (sum, list, column, row, target) {
		let count = 0;
		if ((target+ 1) % row != 0) {
			count += list[target+ 1];				
		}

		if ((target- 1 + row) % row != row - 1) {
			count += list[target- 1];				
		}

		if ((target+ row) < row * column) {
			count += list[target+ row];
		}

		if((target- row) >= 0){
			count += list[target- row];
		}

		if ((target- row) >= 0 && (target+ 1) % row != 0) {
			count += list[target- row + 1];
		}

		if ((target- row) >= 0 && (target- 1 + row) % row != row - 1) {
			count += list[target- row - 1];
		}

		if ((target+ row) < row * column && (target+ 1) % row != 0) {
			count += list[target+ row + 1];
		}

		if ((target+ row) < row * column && (target- 1 + row) % row != row - 1) {
			count += list[target+ row - 1];
		}

			return count;	
	};
	const arroundHandler = function (source, list, column, row, handler, val = {}) {
		if ((source + 1) % row != 0) {
			if (handler(source + 1, list, val, source) === false) return false;		
		}

		if ((source - 1 + row) % row != row - 1) {
			if (handler(source - 1, list, val, source) === false) return false;				
		}

		if ((source + row) < row * column) {
			if (handler(source + row, list, val, source) === false) return false;	
		}

		if((source - row) >= 0){
			if (handler(source - row,list, val, source) === false) return false;	
		}

		if ((source - row) >= 0 && (source + 1) % row != 0) {
			if (handler(source - row + 1, list, val, source) === false) return false;	
		}

		if ((source - row) >= 0 && (source - 1 + row) % row != row - 1) {
			if (handler(source - row - 1, list, val, source) === false) return false;	
		}

		if ((source + row) < row * column && (source + 1) % row != 0) {
			if (handler(source + row + 1, list, val, source) === false) return false;	
		}

		if ((source + row) < row * column && (source - 1 + row) % row != row - 1) {
			if (handler(source + row  - 1, list, val, source) === false) return false;	
		}
		return val;
	};
	let row,
			column,
			sum,
			numThunder,
			timestap = 0,
			time = 0,
			count = 0,
			flag = 0,
			numMartCount = 0;

	liList.forEach((node) => {		
		node.addEventListener('click', (event) => {
			event.preventDefault();			
			if (!timestap) {
				time = 0;
				timestap = setInterval (() => { 
					time = time + 1;
					p3.textContent = `time: ${time}`; 
				},1000);
			}
			
			const body = document.querySelector('body');
			let table = document.querySelector('table');
			if (table) body.removeChild(table);

			table = document.createElement('table');

			if (event.target.textContent === 'low') {
				row = 9;
				column = 9;
				numThunder = 10;
			}

			if (event.target.textContent === 'middle') {
				row = 16;
				column = 16;
				numThunder = 40;
			}

			if (event.target.textContent === 'high') {
				row = 16;
				column = 30;
				numThunder = 99;

			}

			numMartCount = 0;
			p2.textContent = 'Marks Count:' + 0;
			p1.textContent = 'Mines Count:' + numThunder;
			p3.textContent = `time: 0`;
			sum = column * row;
			for (let x = 0; x < sum; x++) {
				MineList[x] = 0;
			}
			
			while (true) {
				let pos = parseInt(Math.random()*sum);
				if (!MineList[pos]) {
					count = count + 1;
					MineList[pos] = 1;
				}
				if (count == numThunder) break;
			}
			for (let x = 0; x < row; x++) {
				let tr = document.createElement('tr');
				for (let y = 0; y < column; y++) {
					let td = document.createElement('td');
					tr.appendChild(td);
				}

				table.appendChild(tr);
			}

			body.appendChild(table);			
			const nodelist = [...document.querySelectorAll('td')];
			const loseHandler = function () {
				for (let i = 0; i < sum; i++) {
					clearInterval(timestap);
					nodelist[i].removeEventListener('mouseup', mouseupHandler);
					nodelist[i].removeEventListener('mousedown', mousedownHandler);
					if (MineList[i] === 1) {
						if (nodelist[i].classList.length === 0) {
							nodelist[i].classList.add('clicked_mine');
						}
					} else {
						if ([...nodelist[i].classList].includes('mark')) {
							nodelist[i].style.backgroundColor = 'black';
						}
					}
				}
				alert('you lose');
			}
			const clickReaction = function (el, nodelist, row, column, source = -1) {
				if (source == -1) return;
				if (arroundHandler(source, nodelist, row, column, (target) => {
					if (MineList[target] != 0) return false;
				}) === false ) return;
				arroundHandler(source, nodelist, row, column, (target,nodelist) => {
					if (nodelist[target].classList.length === 0) {
						nodelist[target].classList.add('clicked_safe');
						clickReaction(nodelist[target], nodelist, row, column, target);
					}
				})
			};
			let nodeSource,source;
			const mousedownHandler = function (event) {
				nodeSource = event.target;
				for (let i = 0; i < sum; i++) {						
					if (nodelist[i] === nodeSource) {
						source = i;
						break;
					}						
				}
				if (flag === 1) {
					if (event.button === 2) {
						flag = 3;
					}
				} else if (event.button === 2) {
					flag = 2;
				}

				if (flag === 2) {
					if (event.button === 0)	{
						flag = 3;
					} 
				} else if (event.button === 0) {
					flag = 1;
				}

				if (flag === 3) {				
					if (nodeSource.classList.length == 0) nodeSource.classList.add('thunder');
					arroundHandler(source, nodelist, row, column,  (target,nodeList) => {
						if (nodelist[target].classList.length === 0) nodelist[target].classList.add('thunder');
					});
				}
			};
			const mouseupHandler = function (event) {			

				if (flag === 1) {
					if (nodeSource.classList.length === 0) {
						if (MineList[source] === 0) {
							nodeSource.classList.add('clicked_safe');
							clickReaction(nodeSource, nodelist, row, column, source);
						} else {
							nodeSource.classList.add('clicked_mine');
							numMartCount = 0;
							loseHandler();
						}
					}
				}

				if (flag === 2) {
					if (nodeSource.classList.length === 0) {
						nodeSource.classList.add('mark');
						numMartCount = numMartCount + 1;
						if(MineList[source] === 1) numThunder = numThunder - 1;
					} else if ([...nodeSource.classList].includes('mark')) {
						nodeSource.classList.remove('mark');
						numMartCount = numMartCount -1;
						if(MineList[source] === 1) numThunder = numThunder + 1;
					}
					p2.textContent='Marks Count:'+numMartCount;
				}

				if (flag === 3) {
					if ([...nodeSource.classList].includes('thunder')) nodeSource.classList.remove('thunder');
					let {markNum, mineNum} = arroundHandler(source, nodelist, row, column,(target, nodelist, val) => {
						if ([...nodelist[target].classList].includes('mark')) {
							val.markNum = val.markNum + 1;
						}
						val.mineNum += MineList[target]; 
					} ,{markNum: 0, mineNum: 0});
					arroundHandler(source, nodelist, row, column,(target, nodelist, val, source) => {
						if ([...nodelist[target].classList].includes('thunder')) {
							if (val.markNum === val.mineNum && val.markNum !== 0 && [...nodelist[source].classList].includes('clicked_safe')) {
								if( MineList[target] === 0) {
									nodelist[target].classList.remove('thunder');
									nodelist[target].classList.add('clicked_safe');
									clickReaction(nodelist[target], nodelist, row, column, target);
								} else {
									nodelist[target].classList.remove('thunder');
									nodelist[target].classList.add('clicked_mine');
									loseHandler();
									return false;
								} 
							} else {
								nodelist[target].classList.remove('thunder');
							}
						}
					}, {markNum, mineNum})
				}

				if(numThunder === 0) {
					nodelist.forEach((node) => {
						node.removeEventListener('mouseup', mouseupHandler);
						node.removeEventListener('mousedown', mousedownHandler);
					});
					clearInterval(timestap);
					alert('you win')
				};
				flag = 0;
			};
			sum = column * row;

			nodelist.forEach((node, index) => {

				count = aroundCount(sum, MineList, row, column, index);
				if (count !== 0) node.textContent = String(count);

				node.addEventListener('mousedown', mousedownHandler);
				node.addEventListener('mouseup', mouseupHandler);
				
			})


		})
	})
	window.addEventListener('contextmenu', (event) => {
		event.preventDefault();
	});
})