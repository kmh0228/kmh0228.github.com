
import 'package:flutter/material.dart';
import './tabs/home.dart';
import './tabs/setting.dart';
import './tabs/other.dart';

class Tabs extends StatefulWidget{
  @override
    _TabsState createState() {
      // TODO: implement createState
      return _TabsState();
    }
}

class _TabsState extends State<Tabs> {
  int _currentIndex = 0;
  List _pageList = [
    Home(), Setting(), Other()
  ];
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Scaffold(
          appBar:AppBar(
            title:Text('flutter title')
          ),
          body:this._pageList[this._currentIndex],
          bottomNavigationBar: BottomNavigationBar(
            items:[
              BottomNavigationBarItem(
                icon:Icon(Icons.home),
                title:Text('首页')
              ),
              BottomNavigationBarItem(
                icon:Icon(Icons.category),
                title:Text('分类')
              ),
              BottomNavigationBarItem(
                icon:Icon(Icons.settings),
                title:Text('设置')
              )
            ],
            currentIndex: this._currentIndex,
            onTap: (int index){
              setState(() {
                              this._currentIndex = index;
                            });
            },
          ),
        );
    }
}