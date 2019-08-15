import 'package:flutter/material.dart';
import '../search.dart';

class Home extends StatefulWidget{
  _HomeState createState(){
    return _HomeState();
  }
}

class _HomeState extends State<Home>{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Column(
        children: <Widget>[
          RaisedButton(
            child: Text('跳转到搜索页面'),
            onPressed: (){
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => Search()
                )
              );
            },
          )
        ],
      );
    }
}


