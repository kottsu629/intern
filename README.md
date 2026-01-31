
## PR/コミットURL

- PR : ```https://github.com/kottsu629/intern/pull/1#issue-3677831671```

- コミット : ```https://github.com/kottsu629/intern/commits/feature/add-readme-and-sql```

##  リポジトリURL
- https://github.com/kottsu629/intern


## デモ動画

- https://github.com/kottsu629/intern/tree/main/demo

## 起動方法

### バックエンド
- docker起動（MySQL+Go）
  
```docker compose up -d ```

- 以下にアクセスし、レスポンスが返れば起動成功です

```http://localhost:8080```

### フロントエンド

- 環境変数

```NEXT_PUBLIC_API_BASE_URL=http://localhost:8080```

- インストール

```npm install```

- 起動

```npm run dev```

- 以下にアクセスしてレスポンスが返れば起動成功

```http://localhost:3000```

### 環境

- MYSQL_USER=app
- MYSQL_PASSWORD=app
- MYSQL_DATABASE=app
- MYSQL_ROOT_PASSWORD: root

## テスト実行方法

バックエンド（Go）で 1 本のユニットテストを用意しています。  
ページネーション用の小さな関数 `calcTotalPages` が正しく動作することを確認しています。

### 実行コマンド

```bash
go test ./...
```
### テスト内容の概要
- `calcTotalPages` が総件数と1ページあたり件数から正しいページ数を計算できることを確認
- 端数切り上げのケース、0件の場合、1ページあたり件数が0以下の場合など複数パターンをチェック



## 使用した主な SQL

### 1. 入札作成（POST /bids）
```sql
INSERT INTO bids (car_id, amount, bidder, request_id)
VALUES (?, ?, ?, ?);
```

### 2. 入札一覧取得（GET /bids?item_id=）
```sql
SELECT id, car_id, amount, bidder, request_id, created_at
FROM bids
WHERE car_id = ?
ORDER BY created_at DESC;
```

### 3. 車両ごとの最高入札額（結合 + 集計）
```sql
SELECT
  c.id       AS car_id,
  c.model    AS model,
  MAX(b.amount) AS max_bid
FROM cars c
LEFT JOIN bids b ON c.id = b.car_id
GROUP BY c.id, c.model;
```
## EXPLAIN(2本）

- `入札一覧取得`
  
  <img width="1863" height="453" alt="image" src="https://github.com/user-attachments/assets/c63d43be-af62-4cd4-8a84-c934bb0afd03" />

- `車両ごとの最高入札額`

  <img width="1917" height="547" alt="image" src="https://github.com/user-attachments/assets/1f75b24a-e12a-442a-8c23-7f451326f7ca" />




## DDL(cars/bids)

```sql
CREATE TABLE IF NOT EXISTS cars (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  model VARCHAR(64) NOT NULL,
  price INT NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS bids (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  car_id BIGINT NOT NULL,
  amount INT NOT NULL,
  bidder VARCHAR(64) NOT NULL,
  request_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bids_car FOREIGN KEY (car_id) REFERENCES cars(id),
  UNIQUE KEY uk_request_id (request_id)
);
```


## インデックス

- `idx_cars_price`  
  価格フィルタや並び替えを高速化するため、`cars.price` にインデックスを付与。

- `idx_bids_car_created`  
  `GET /bids?item_id=` の  
  `WHERE car_id = ? ORDER BY created_at DESC` を高速にするため、  
  `bids(car_id, created_at)` に複合インデックスを付与。

## SSR / CSR の選択

Client Side Rendering（CSR）を採用。
車両一覧・詳細は SEO を特に必要としておらず、価格フィルタやページネーションなどクライアント側での状態更新が中心のため、API(Go) と連携するシンプルであるCSRを採用した。

## AI利用メモ

### どんな質問をしたか

- Git の初期設定（git init、コミット、push など）のやり方を質問した

- feature ブランチの作り方と PR 作成の流れを質問した

- コンフリクトが出たときにどう対処すればいいか質問した

- 次に何をすればよいか分からない時に、手順を細かく質問した

- Next.js と TypeScript の違い・関係性を質問した

- inter_front フォルダを GitHub に反映させる方法を質問した

- Docker や backend の構成が合っているか確認のために質問した

- コードの説明


### 採用したもの

- Git コマンドの手順（ブランチ作成 → コミット → push の流れ）

- PR 作成の方法（Compare & pull request の場所など）

- inter_front を GitHub に載せるための作業手順

- コンフリクト画面の意味・どれを「Accept」すれば良いかという説明

- README に書く内容の構成（PR URL、起動方法 など）

- コードの説明

### 不採用にしたもの

- 完全に AI が作ったコード

- 一部の高度な Git 操作の説明


### 懸念点（AIを使ったことで気をつけたこと）

- AIの説明通りにやっても実際の GitHub 画面と違うことがあったので、自分で画面を確認しながら作業した





