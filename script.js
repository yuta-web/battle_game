// 変数定義
const damageRange = 0.2;
const criticalHitRate = 0.1;
let logIndex = 0;
let nowKilledNumber = 0;
let targetKilledNumber = 2;



// ステータス
const playerData = {
	name: 'プレイヤー',
	hp: 100,
	attack: 5,
	defence: 2
}

const enemiesData = [
	{
		name: 'スライム',
		hp: 50,
		attack: 3,
		defence: 1
	},
	{
		name: 'フェアリー',
		hp: 60,
		attack: 4,
		defence: 2
	},
	{
		name: 'ガーゴイル',
		hp: 100,
		attack: 5,
		defence: 2
	},
]



// 敵の出現乱数
let enemyData = enemiesData[Math.floor(Math.random() * enemiesData.length)];



// ダメージ計算
playerData["maxHp"] = playerData["hp"];
enemyData["maxHp"] = enemyData["hp"];

function damageCalculation(attack, defence) {
	const maxDamege = attack * (1 + damageRange);
	const minDamege = attack * (1 - damageRange);
	const attackDamage = Math.floor(Math.random() * (maxDamege - minDamege) + minDamege); //max~minの間のダメージを出す

	const damage = attackDamage - defence;

	if (damage < 1) {
		return 0
	} else {
		return damage;
	}
}


// モーダル
function showModal(title, hiddenNextButton = false) {
	document.getElementById("js-mask").classList.add("active");
	document.getElementById("js-modal").classList.add("active")
	document.getElementById("js-modal-title").textContent = title;
	if (hiddenNextButton) {
		document.getElementById("js-modal-next-button").classList.add("hidden");
	}
}



// テキスト挿入
function insertText(id, text) {
	document.getElementById(id).textContent = text;
}
insertText("js-player-name", playerData["name"]);
insertText("js-current-player-hp", playerData["hp"]);
insertText("js-max-player-hp", playerData["hp"]);

insertText("js-enemy-name", enemyData["name"]);
insertText("js-current-enemy-hp", enemyData["hp"]);
insertText("js-max-enemy-hp", enemyData["hp"]);

insertText("js-now-killed-numbers", nowKilledNumber);
insertText("js-target-killed-numbers", targetKilledNumber);



// 攻撃アクション
document.getElementById("js-attack").addEventListener("click", function() {
	let victory = false;
	let defeat = false;



	// ライフカラー
	let enemyHpColor = (enemyData["hp"] / enemyData["maxHp"] * 100);
	let playerHpColor = (playerData["hp"] / playerData["maxHp"] * 100);

	function changeColor(id, color) {
		document.getElementById(id).style.backgroundColor = color
	}

	if (enemyHpColor <= 50) {
		changeColor("js-current-enemy-hp-gauge", "yellow");
	}
	if (enemyHpColor <= 10) {
		changeColor("js-current-enemy-hp-gauge", "red");
	}
	if (playerHpColor <= 50) {
		changeColor("js-current-player-hp-gauge", "yellow");
	}
	if (playerHpColor <= 10) {
		changeColor("js-current-player-hp-gauge", "red");
	}



	// ログ
	const enemyName = '<span style="color: red;">' + enemyData["name"] + "</span>";
	const playerName = '<span style="color: blue;">' + playerData["name"] + "</span>";

	function insertLog(texts) {
		const logsElement = document.getElementById("js-logs");
		const createLog = document.createElement("li");
		logIndex++;
		createLog.innerHTML = logIndex + "：" + texts;
		logsElement.insertBefore(createLog, logsElement.firstChild);
	}


	// プレイヤーから敵への攻撃処理
	let playerDamage = damageCalculation(playerData["attack"], enemyData["defence"]);
	if (Math.random() < criticalHitRate){
		playerDamage *= 3;
		insertLog(playerName + "の攻撃！クリティカルヒット！" + enemyName + "に" + playerDamage + "のダメージ")
	} else {
		insertLog(playerName + "の攻撃！" + enemyName + "に" + playerDamage + "のダメージ")
	}
	enemyData["hp"] -= playerDamage;
	insertText("js-current-enemy-hp", enemyData["hp"]);
	document.getElementById("js-current-enemy-hp-gauge").style.width = (enemyData["hp"] / enemyData["maxHp"] * 100) + "%";

	// 勝敗　もし買ったら
	if (enemyData["hp"] <= 0) {
		victory = true

		enemyData["hp"] = 0;
		insertText("js-current-enemy-hp", enemyData["hp"]);
		document.getElementById("js-current-enemy-hp-gauge").style.width = "0%"

		// モーダル
		showModal(enemyData["name"] + "を倒した！");
	}

	// 敵からプレイヤーへの攻撃処理
	// 敵が死んだときは以下の処理をしない
	if (!victory) {
		let enemyDamage = damageCalculation(enemyData["attack"], playerData["defence"]);
		if (Math.random() < criticalHitRate){
			enemyDamage *= 3;
			insertLog(enemyName + "の攻撃！クリティカルヒット！" + playerName + "に" + enemyDamage + "のダメージ")
		} else {
			insertLog(enemyName + "の攻撃！" + playerName + "に" + enemyDamage + "のダメージ")
		}
		playerData["hp"] -= enemyDamage;
		insertText("js-current-player-hp", playerData["hp"]);
		document.getElementById("js-current-player-hp-gauge").style.width = (playerData["hp"] / playerData["maxHp"] * 100) + "%";

		// 勝敗　もし負けたら
		if (playerData["hp"] <= 0) {
			defeat = true

			playerData["hp"] = 0;
			insertText("js-current-player-hp", playerData["hp"]);
			document.getElementById("js-current-player-hp-gauge").style.width = "0%"

			showModal(enemyData["name"] + "に負けた...", ture);
		}
	}

// ゲームが終わったら処理をしない
	if (victory || defeat) {
		this.classList.add("deactive");
	}

// 敵を倒したら討伐数を増やす
	if (victory) {
		nowKilledNumber++;
		insertText("js-now-killed-numbers", nowKilledNumber);
	}

});

document.getElementById("modal-next-button").addEventListener("click", function(){
	enemyData = enemiesData[Math.floor(Math.random() * enemiesData.length)];
})