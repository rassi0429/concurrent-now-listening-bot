# concurrent-now-listening-bot

LastFMのNow ListeningをConcurrentに投稿するBotです。

## helm repo

`https://rassi0429.github.io/helmcharts/`

## 環境変数
helmのvaluesも同じ名前になっています。

| 環境変数名                  | 説明                                   |
|------------------------|--------------------------------------|
| CCID                   | Concurrent CCID                      |
| PRIVATE_KEY            | Concurrent Private key               |
| CONCURRENT_HOST        | Concurrent account host              |
| CONCURENT_POST_STREAMS | now listeningを流すストリームをカンマ区切りで入れてください |
| LASTFM_API_USER        | lastfmのユーザ名                          |
| LASTFM_API_KEY         | lastfm app api key                   |
