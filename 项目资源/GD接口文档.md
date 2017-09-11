### 获取首页和海淘的最新数据个数

---

| 地址 | http://guangdiu.com/api/getnewitemcount.php |
|:----:|:-------------------------------------------|
| 参数1 | cnmaxid(国内每次请求获取到的数据中第一组中的id) |
| 参数2 | usmaxid(国外每次刷新获取到的数据中第一组中的id) |
| 结果参考 | {<br>"status": "ok",<br>"cn": "10",<br>"us": "5"<br>} |
 

### 近半小时热门

---

| 地址 | http://guangdiu.com/api/gethots.php |
|:----:|:------------------------------------------|
| 结果参考 | {<br>"hottype": "CNHALFHOUR",<br>"status": "ok",<br>"data": [<br>{<br>"id": 3733291,<br>"title": "技嘉（GIGABYTE） GB-BXi3-5010 Brix 迷你PC 1599元",<br>"image": "http://imgcdn.guangdiu.com/bcfc2e51d2f3aa0be57b39dc03fb0647.jpg"<br>},<br>.<br>.<br>.<br>{<br>"id": 3733281,<br>"title": "GIGABYTE 技嘉 BXi5H-5200 紧凑型电脑 1849元，需100元定金",<br>"image": "http://imgcdn.guangdiu.com/93f04ae79a190f05c7fbc66a650ed990.jpg"<br>}<br>]<br>} |


### 首页/海淘/筛选

---

| 地址 | http://guangdiu.com/api/getlist.php |
|:----:|:------------------------------------|
| 参数1 | country：国内(ch) 或 国外(us) |
| 参数2 | count：每次返回的数据个数 |
| 参数3 | sinceid：上一次请求结果中数组最后一个ID（追加数据时传递）|
| 参数4 | mall：电商名称（当用户指定某个电商时传递）|
| 结果参考 | {<br>"status": "ok",<br>"newincluded": 30,<br>"data": [<br>{<br>"id": 3733408,<br>"title": "￥2948.00 2948新低NORITZ 能率 GQ-16E3FEX 16L 燃气热水器 2948新低",<br>"pubtime": "2017-03-05 17:48:13",<br>"image": "http://imgcdn.guangdiu.com/444a9048877c51d160137f2017855e2f.jpg?imageView2/2/w/224/h/224",<br>"imgw": 400,<br>"imgh": 400,<br>"iftobuy": 1,<br>"fromsite": "没得比",<br>"country": "cn",<br>"mall": "苏宁易购",<br>"cates": [<br>"electrical"<br>],<br>"buyurl": "http://guangdiu.com/go.php?id=3733408",<br>"dealfeature": "0"<br>},<br>.<br>.<br>.<br>{<br>"id": 3733404,<br>"title": "GOO.N 大王 维E系列 婴儿纸尿裤 L58片 79元",<br>"pubtime": "2017-03-05 17:48:12",<br>"image": "http://imgcdn.guangdiu.com/b3e95b22204ae1570847d1d4fdc7979b.jpg?imageView2/2/w/224/h/224",<br>"imgw": 800,<br>"imgh": 800,<br>"iftobuy": 1,<br>"fromsite": "没得比",<br>"country": "cn",<br>"mall": "京东商城",<br>"cates": [<br>"baby",<br>"clothes"<br>],<br>"buyurl": "http://guangdiu.com/go.php?id=3733404",<br>"dealfeature": "0"<br>}<br>]<br>} |


### 小时风云榜

---

| 地址 | http://guangdiu.com/api/getranklist.php（无参数时默认最近时间数据） |
|:----:|:----------------------------------------|
| 参数1 | date(传入日期，格式：20160711) |
| 参数2 | hour(传入查询的时间，24小时制 格式：1~24) |
| 结果参考 | {<br>"status": "ok",<br>"rankhour": "17",<br>"rankdate": "2017-03-05",<br>"displaydate": "今日",<br>"rankduring": "16:00-17:00",<br>"hasnexthour": "0",<br>"nexthourhour": "",<br>"nexthourdate": "",<br>"lasthourhour": "16",<br>"lasthourdate": "20170305",<br>"data": [<br>{<br>"id": 3733062,<br>"rank": 1,<br>"title": "灵动创想 全铜 指尖螺旋 减压玩具 协助戒烟 25元包邮 45减20元券后",<br>"pubtime": "2017-03-05 16:16:15",<br>"image": "http://imgcdn.guangdiu.com/faebe03c67fb03b752b1a5569a5e2eda.jpg?imageView2/2/w/224/h/224",<br>"imgw": 300,<br>"imgh": 300,<br>"fromsite": "",<br>"mall": "天猫",<br>"iftobuy": 1,<br>"buyurl": "http://detail.tmall.com/item.htm?id=545588206918",<br>"dealfeature": "0"<br>},<br>.<br>.<br>.<br>{<br>"id": 3732798,<br>"rank": 2,<br>"title": "耐克（NIKE） SOCK DART KJCRD 男子运动鞋 亮丽配色 ￥589",<br>"pubtime": "2017-03-05 15:00:28",<br>"image": "http://imgcdn.guangdiu.com/9eaf38d6f49fbcc87342bc7b61f2a220.jpg?imageView2/2/w/224/h/224",<br>"imgw": 450,<br>"imgh": 448,<br>"fromsite": "",<br>"mall": "Nike.com",<br>"iftobuy": 1,<br>"buyurl": "http://guangdiu.com/go.php?id=3732798",v"dealfeature": "0"<br>}<br>]<br>} |


### 搜索优惠

---

| 地址 | http://guangdiu.com/api/getresult.php |
|:----:|:--------------------------------------|
| 参数1 | count（返回数据个数）|
| 参数2 | q（用户查询的关键字）|
| 参数3 | sinceid（搜索结果最后一组数据的id）|
| 结果参考 | {<br>"status": "ok",<br>"newincluded": 2,<br>"data": [<br>{<br>"id": 3733398,<br>"title": "得其利是 除菌洗衣液 2kg 16.9元包邮 19.9减3元券后",<br>"pubtime": "2017-03-05 17:48:09",<br>"image": "http://imgcdn.guangdiu.com/d8575a4e1fb9d13f14fd5dcf5b9314bc.jpg?imageView2/2/w/224/h/224",<br>"imgw": 300,<br>"imgh": 300,<br>"iftobuy": 1,<br>"fromsite": "",<br>"country": "cn",<br>"mall": "天猫",<br>"cates": [<br>"daily",<br>"stockup"<br>],<br>"buyurl": "http://detail.tmall.com/item.htm?id=537930877937",<br>"dealfeature": 0<br>},<br>.<br>.<br>.<br><br>{<br>"id": 3733397,<br>"title": "361度 男士春季提花网面运动鞋 119元包邮 159减30元券后",<br>"pubtime": "2017-03-05 17:48:09",<br>"image": "http://imgcdn.guangdiu.com/1460bfa9e97fff9a7203f92d26e5ef25.jpg?imageView2/2/w/224/h/224",<br>"imgw": 300,<br>"imgh": 300,<br>"iftobuy": 1,<br>"fromsite": "",<br>"country": "cn",<br>"mall": "天猫",<br>"cates": [<br>"clothes"<br>],<br>"buyurl": "http://detail.tmall.com/item.htm?id=526575813673",<br>"dealfeature": 0<br>}<br>]<br>}


> 译注：
> 
> - 结果中 **status字段** 表示请求数据状态，返回 **no** 表示获取失败,**OK** 表示成功
> - 结果中 **newincluded字段** 表示返回数据的个数






