import 'package:flutter/material.dart';

class Pages2 extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return ListView(
        children: <Widget>[
          ListTile(
            title:Text('data1')
          ),
          ListTile(
            title:Text('data2')
          ),
          ListTile(
            title:Text('data3')
          )
        ],
      );
    }
}