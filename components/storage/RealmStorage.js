
//外部调用
var RealmBase = {};

import Realm from 'realm';

const HomeSchame = {
  name: 'HomeData',
  properties: {
    id: 'int',
    title: 'string',
    image: 'string',
    mall: 'string',
  }
}

const HtSchame = {
  name: 'HtData',
  properties: {
    id: 'int',
    title: 'string',
    image: 'string',
    mall: 'string',
  }
}

//初始化realm
let realm = new Realm({schema:[HomeSchame,HtSchame]});

// 增加字段
RealmBase.created = (schame,data)=>{
  realm.write(()=>{
    for (let i = 0; i < data.length; i++) {
      let temp = data[i];
      realm.create(schame,{id:temp.id,title:temp.title,image:temp.image,mall:temp.mall})
    }
  });
}

//查询字段
RealmBase.loadAll = (schame)=>{
  return realm.objects(schame);
}

//条件查询
RealmBase.filtered = (schame,filtered)=>{
  //获取对象
  let objects = realm.objects(schame);
  // 筛选
  let object = objects.filtered(filtered);

  if (object) {
    return object;
  }else{
    return '未找到数据';
  }
}

// 删除所有数据
RealmBase.removeAllData = (schame)=>{
  realm.write(()=>{
    //获取对象
    let objects = realm.objects(schame);
    // 删除数据
    realm.delete(objects);
  })
}

// 使用全局变量---一个地方引用其他地方不用再引用
global.RealmBase = RealmBase;
