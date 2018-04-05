/*
 * File: app/store/MenuTreeStore.js
 *
 * This file was generated by Sencha Architect version 4.2.3.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.5.x Classic library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.5.x Classic. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('SmartMenu.store.MenuTreeStore', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'SmartMenu.model.MenuTreeData',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'MenuTreeStore',
            autoLoad: true,
            model: 'SmartMenu.model.MenuTreeData',
            proxy: {
                type: 'ajax',
                url: 'resources/MenuTree.json',
                reader: {
                    type: 'json',
                    rootProperty: 'titles'
                }
            },
            listeners: {
                load: {
                    fn: me.onTreeStoreLoad,
                    scope: me
                }
            }
        }, cfg)]);
    },

    onTreeStoreLoad: function(treestore, records, successful, operation, node, eOpts) {
        var me = this;
        var navBar = Ext.ComponentQuery.query("[reference=navigationToolbar]")[0]; //get view of navigationToolbar;
        var ctrPanel = Ext.ComponentQuery.query("[reference=centerPanel]")[0]; //get view of centerPanel;
        Ext.each(records, function(rec, index){
            console.log("check: ", rec);
            var childrenLength = (rec.data.leaf === true)? 0 : rec.data.sub.length ;
            var i = childrenLength-1;
            var currentItem = rec.data;
            console.log("rec: ", rec);
            if(childrenLength > 0){
                    navBar.add({
                        xtype: "button",
                        text: currentItem.name,
                        listeners: {
                             click:  onSelectMenu(this, click, currentItem)
                        },
                        menu: {
                            xtype: 'menu',
                            reference: "menu"+currentItem.name
                        }
                    });
                    var menuBox = Ext.ComponentQuery.query("[reference=menu"+currentItem.name+"]")[0];
                    while(i >= 0){
                        if(currentItem.sub[i].leaf !== true){
                            var childrenArr = currentItem.sub[i];
                             menuBox.add({
                                xtype: 'menuitem',
                                text:  currentItem.sub[i].name,
                                menu :{
                                    xtype: 'menu',
                                    reference: "menu"+currentItem.sub[i].name
                                }
                             });
                             callMe("menu"+currentItem.sub[i].name, childrenArr);
                        } else {
                             menuBox.add({
                                xtype: 'menuitem',
                                text:  currentItem.sub[i].name,
                             });
                        }

                        i--;
                    }


            } else{
                navBar.add({
                    xtype: "button",
                    text: currentItem.name
                });
            }

        }, this);

        function callMe(subMenuRef, children){
            //console.log("RefOfParent: ", subMenuRef);
            //console.log("Children: ", children);
            var subMenuBox = Ext.ComponentQuery.query("[reference="+subMenuRef+"]")[0];
            var j = children.sub.length-1 ;
            while(j >= 0){
                if(children.sub[j].leaf !== true){
                    var childrenArr = children.sub[j];
                     subMenuBox.add({
                         xtype: 'menuitem',
                         text:  children.sub[j].name,
                         menu :{
                             xtype: 'menu',
                             reference: "menu"+children.sub[j].name
                         }
                     });
                     callMe("menu"+children.sub[j].name, childrenArr);
                }
                else {
                    subMenuBox.add({
                        xtype: 'menuitem',
                        text:  children.sub[j].name,
                    });
                }
                j--;
            }
        }

        function onSelectMenu(btn, click, currentItem){
            ctrPanel.setHtml("This is "+ currentItem.name + " content");
        }
    }

});