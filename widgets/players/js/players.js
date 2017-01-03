/*
    ioBroker.vis players-widgets Widget-Set

    version: "0.0.1"

    Copyright 10.2015-2016 instalator<vvvalt@mail.ru>

*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "myColor":          {"en": "myColor",       "de": "Hauptfarbe",  "ru": "Мой цвет"},
        "myColor_tooltip":  {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AHauptfarbe",
            "ru": "Описание\x0AmyColor"
        },
        "htmlText":         {"en": "htmlText",      "de": "htmlText",   "ru": "htmlText"},
        "group_extraMyset": {"en": "extraMyset",    "de": "extraMyset", "ru": "extraMyset"},
        "extraAttr":        {"en": "extraAttr",     "de": "extraAttr",  "ru": "extraAttr"},
        "oid_play":         {"en": "Play",          "de": "Play",       "ru": "Play"},
        "oid_next":         {"en": "Next",          "de": "Next",       "ru": "Следующий"},
        "oid_prev":         {"en": "Previous",      "de": "Previous",   "ru": "Предыдущий"},
        "oid_stop":         {"en": "Stop",          "de": "Stop",       "ru": "Стоп"},
        "oid_pause":        {"en": "Pause",         "de": "Pause",      "ru": "Пауза"},
        "oid_seek":         {"en": "Seek",          "de": "Seek",       "ru": "Поиск"},
        "oid_vol":          {"en": "Volume",        "de": "Lautsärke",  "ru": "Громкость"},
        "oid_mute":         {"en": "Mute",          "de": "Mute",       "ru": "Mute"},
        "oid_shuffle":      {"en": "Shuffle",       "de": "Shuffle",    "ru": "shuffle"},
        "oid_repeat":       {"en": "Repeat",        "de": "Repeat",     "ru": "Repeat"},
        "oid_artist":       {"en": "Artist",        "de": "Artist",     "ru": "Исполнитель"},
        "oid_title":        {"en": "Title",         "de": "Title",      "ru": "Название"},
        "oid_album":        {"en": "Album",         "de": "Album",      "ru": "Альбом"},
        "oid_bitrate":      {"en": "Bitrate",       "de": "Bitrate",    "ru": "Bitrate"},
        "oid_playlist":     {"en": "Playlist",      "de": "Playlist",   "ru": "Playlist"}
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Instance":  {"en": "Instance", "de": "Instanz", "ru": "Инстанция"}
});

// this code can be placed directly in players.html
vis.binds.players = {
    version: "0.0.1",
    showVersion: function () {
        if (vis.binds.players.version) {
            console.log('Version players: ' + vis.binds.players.version);
            vis.binds.players.version = null;
        }
    },
    states: {
        oid_play:    {val: undefined, role: 'button.play',      selector: '', objName: 'play'},
        oid_next:    {val: undefined, role: 'button.next',      selector: '', objName: 'next'},
        oid_prev:    {val: undefined, role: 'button.prev',      selector: '', objName: ''},
        oid_stop:    {val: undefined, role: 'button.stop',      selector: '', objName: ''},
        oid_pause:   {val: undefined, role: 'button.pause',     selector: '', objName: ''},
        oid_seek:    {val: 0,         role: 'media.seek',       selector: '', objName: ''},
        oid_vol:     {val: 0,         role: 'level.volume',     selector: '', objName: ''},
        oid_mute:    {val: undefined, role: 'media.mute',       selector: '', objName: ''},
        oid_shuffle: {val: undefined, role: 'media.mode.shuffle', selector: '', objName: ''},
        oid_repeat:  {val: undefined, role: 'media.mode.repeat', selector: '', objName: ''},
        oid_artist:  {val: '',        role: 'media.artist',     selector: '', objName: ''},
        oid_title:   {val: '',        role: 'media.title',      selector: '', objName: ''},
        oid_album:   {val: '',        role: 'media.album',      selector: '', objName: ''},
        oid_bitrate: {val: '',        role: 'media.bitrate',    selector: '', objName: ''}
    },
    
    createWidgetWinampPlayer: function (widgetID, view, data, style) { //tplWinampPlayer
        var $div       = $('#' + widgetID);
        var volSlider  = $div.find('.winamp-vol-slider');
        var seekSlider = $div.find('.winamp-seek-slider');
        var states     = {};

        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.players.createWidgetWinampPlayer(widgetID, view, data, style);
            }, 100);
        }

        $(function() {
            // optimize memory, so the whole data object can be cleaned by garbage collector
            var oid_vol = data.oid_vol;

            if (oid_vol) {
                volSlider.slider({
                    range: 'min',
                    min: 0,
                    value: vis.states['data.oid_vol.val'],//states.oid_vol.val,
                    start: function (event,ui) {},
                    slide: function (event, ui) {
                        vis.setValue(oid_vol, ui.value);
                    },
                    stop: function (event,ui) {}
                });
            } else {
                volSlider.hide();
            }

            // optimize memory, so the whole data object can be cleaned by garbage collector
            var oid_seek = data.oid_seek;
            if (oid_seek) {
                seekSlider.slider({
                    range: 'min',
                    min:    0,
                    max:    100,
                    value:  0,//states.oid_seek.val,
                    start:  function (event, ui) {},
                    slide:  function (event, ui) {
                        vis.setValue(oid_seek, ui.value);
                    },
                    stop: function (event, ui) {}
                });
            } else {
                seekSlider.hide();
            }
        });

        function updateStates() {
            var $div        = $('#' + widgetID);
            var volSlider  = $div.find('.winamp-vol-slider');
            var seekSlider = $div.find('.winamp-seek-slider');

            states = JSON.parse(JSON.stringify(vis.binds.players.states));

            for (var s in states) {
                if (states.hasOwnProperty(s) && data[s] && data[s] !== 'nothing_selected') {
                    states[s].val = vis.states[data[s] + '.val'];
                }
            }

            if (states.oid_artist.val) {
                $div.find('.winamp-artist').text('Artist: ' + states.oid_artist.val);
            } else {
                $div.find('.winamp-artist').hide();
            }

            if (states.oid_title.val) {
                $div.find('.winamp-title').text('Title: ' + states.oid_title.val);
            } else {
                $div.find('.winamp-title').hide();
            }

            if (states.oid_album.val) {
                $div.find('.winamp-album').text('Album: ' + states.oid_album.val);
            } else {
                $div.find('.winamp-album').hide();
            }

            if (states.oid_bitrate.val) {
                $div.find('.winamp-bitrate').text('kbps: ' + states.oid_bitrate.val);
            } else {
                $div.find('.winamp-bitrate').hide();
            }

            if (states.oid_repeat.val){
                $div.find('.winamp-repeat').show();
            } else {
                $div.find('.winamp-repeat').hide();
            }

            if (states.oid_shuffle.val){
                $div.find('.winamp-shuffle').show();
            } else {
                $div.find('.winamp-shuffle').hide();
            }

            if (volSlider.hasClass('ui-slider')) {
                volSlider.slider('value', states.oid_vol.val);
            }

            if (seekSlider.hasClass('ui-slider')) {
                seekSlider.slider('value', parseInt(states.oid_seek.val, 10));
            }
        }

        $div.find('.winamp-btn').on('click', function (e) {
            switch (e.target.id) {
                case 'mute':
                    toggle('mute');
                    break;
                case 'play':
                    vis.setValue(data.oid_play, true);
                    break;
                case 'next':
                    vis.setValue(data.oid_next, true);
                    break;
                case 'prev':
                    vis.setValue(data.oid_prev, true);
                    break;
                case 'stop':
                    vis.setValue(data.oid_stop, true);
                    break;
                case 'pause':
                    toggle('pause');
                    break;
                case 'shuffle':
                    toggle('shuffle');
                    break;
                case 'repeat':
                    toggle('repeat');
                    break;
                case 'playlist':
                    //vis.setValue(data.oid_next, true);
                    break;
                case 'library':
                    //vis.setValue(data.oid_next, true);
                    break;
                default:
                    break;
            }
        });

        function toggle(btn) {
            var oid   = 'oid_' + btn;
            var val   = states[oid].val;
            var state = data['oid_' + btn];

            console.log('Press button - ' + btn + ' / val=' + val + ' /state=' + state);

            if (val === 0 || val === '0' || val === false || val === 'false' || val === 'off') {
                vis.setValue(state, true);
            } else if (val === 1 || val === '1' || val === true || val === 'true' || val === 'on') {
                vis.setValue(state, false);
            }
        }

        //debugger;
        // subscribe on updates of values
        var bound = [];
        for (var s in vis.binds.players.states) {
            if (!data[s] || data[s] === 'nothing_selected') continue;

            bound.push(data[s] + '.val');
            vis.states.bind(data[s] + '.val', updateStates);
        }

        if (bound.length) {
            // remember all ids, that bound
            $div.data('bound', bound);
            // remember bind handler
            $div.data('bindHandler', updateStates);
        }
        // initial update
        updateStates();

        // destroy sliders
        $div.data('destroy', function (id) {
            var $div       = $('#' + id);
            var volSlider  = $div.find('.winamp-vol-slider');
            var seekSlider = $div.find('.winamp-seek-slider');
            if (volSlider.hasClass('ui-slider')) volSlider.slider('destroy');
            if (seekSlider.hasClass('ui-slider')) seekSlider.slider('destroy');
        });
    },
    createWidgetWinampPlaylist: function (widgetID, view, data, style) { //tplWinampPlayer
        var $div = $('#' + widgetID);
        //var states = {};
        var playlist;
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.players.createWidgetWinampPlaylist(widgetID, view, data, style);
            }, 100);
        }

        function updateStates(pl) {
           /* states = JSON.parse(JSON.stringify(vis.binds.players.states));
            for (var s in states) {
                if( states.hasOwnProperty(s)){
                    if (data[s] && data[s] !== 'nothing_selected') { states[s].val = vis.states[data[s] + '.val']; }
                }
            }*/
            playlist = JSON.parse(pl);

                /*$div.find("#playListContainer").empty();
                _playlist.forEach(function(item, i, arr) {
                    $div.find("#playListContainer").append("<li class='item"+(i+1)+"'>"+(i+1)+' - '+_playlist[i].label+"</li>");
                });
                $div.find("#playListContainer .item"+(parseInt(vis.states[data.oid_position + '.val'])+1)).addClass("active");
                $div.find('#playListContainer').on('click', "li", function(){
                    var n=$(this).index();
                    vis.setValue(data.oid_position, n);
                });*/
            console.log(playlist);
             $div.find('#winamp-playlist-container').empty();
             playlist.forEach(function(item, i, plst) {
                 var obj = playlist[i];
                 console.log(obj);
                 $div.find('#winamp-playlist-container').append('<li class="item' + (i + 1) + '">' + ( i + 1) + ' - ' + obj.file + '</li>');
             });
        }
        
        $('.winamp-btn').on('click', function(e){

        });

        //debugger;
        // subscribe on updates of values
        if (data.oid_playlist) {
            vis.states.bind(data.oid_playlist + '.val', function (e, newVal, oldVal) {
                updateStates(newVal);
            });
        }
        // initial update
        //updateStates();
    }
    
    /*
     {
     "items": [{
     "album": "",
     "artist": [],
     "episode": -1,
     "fanart": "",
     "file": "smb://192.168.1.10/F/CAFE SOCIETY/BDMV/index.bdmv",
     "genre": [],
     "label": "index.bdmv",
     "playcount": 1,
     "rating": 0,
     "season": -1,
     "showtitle": "",
     "thumbnail": "",
     "title": "",
     "track": -1,
     "type": "unknown",
     "year": 1969
     }],
     "limits": {
     "end": 1,
     "start": 0,
     "total": 1
     }
     }
     */
    
    
    
    
    
};

if (vis.editMode) {
    vis.binds.players.onPlayChanged = function (widgetID, view, newId, attr, isCss, oldValue) {
        if (oldValue && oldValue !== 'nothing_selected') return;
        console.log('---------: ' + widgetID +' - ' + view + ' - ' + newId + ' - ' + attr + ' - ' + isCss);

        var changed = [];
        var obj = vis.objects[newId];

        // If it is real object and SETPOINT
        if (obj && obj.common && obj.type === 'state') {
            var roles = [];
            var s;
            for (s in vis.binds.players.states) {
                if (!vis.binds.players.states.hasOwnProperty(s) || s === 'oid_alias') continue;
                if (vis.views[view].widgets[widgetID].data[s]) continue;

                roles.push(vis.binds.players.states[s].role);
            }

            if (roles.length) {
                var result = vis.findByRoles(newId, roles);
                if (result) {
                    var name;
                    for (var r in result) {
                        if (!result.hasOwnProperty(r)) continue;

                        name = null;
                        for (s in vis.binds.players.states) {
                            if (!vis.binds.players.states.hasOwnProperty(s)) continue;

                            if (vis.binds.players.states[s].role === r) {
                                changed.push(s);
                                vis.views[view].widgets[widgetID].data[s] = result[r];
                                vis.widgets[widgetID].data[s] = result[r];
                                break;
                            }
                        }
                    }
                }
            }
        }
        return changed;
    };
}
	
vis.binds.players.showVersion();
