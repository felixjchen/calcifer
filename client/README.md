Sample SFTP

```
[
  {
    "filename": ".cloud-locale-test.skip",
    "longname": "-rw-r--r--    1 root     root            0 Mar  4 03:23 .cloud-locale-test.skip",
    "attrs": {
      "mode": 33188,
      "permissions": 33188,
      "uid": 0,
      "gid": 0,
      "size": 0,
      "atime": 1614828187,
      "mtime": 1614828187
    }
  },
  {
    "filename": ".bashrc",
    "longname": "-rw-r--r--    1 root     root         3106 Dec  5  2019 .bashrc",
    "attrs": {
      "mode": 33188,
      "permissions": 33188,
      "uid": 0,
      "gid": 0,
      "size": 3106,
      "atime": 1614828317,
      "mtime": 1575556761
    }
  },
  {
    "filename": ".profile",
    "longname": "-rw-r--r--    1 root     root          161 Dec  5  2019 .profile",
    "attrs": {
      "mode": 33188,
      "permissions": 33188,
      "uid": 0,
      "gid": 0,
      "size": 161,
      "atime": 1614828317,
      "mtime": 1575556761
    }
  },
  {
    "filename": ".ssh",
    "longname": "drwx------    2 root     root         4096 Mar  4 03:04 .ssh",
    "attrs": {
      "mode": 16832,
      "permissions": 16832,
      "uid": 0,
      "gid": 0,
      "size": 4096,
      "atime": 1614832559,
      "mtime": 1614827044
    },
    "children": [
      {
        "filename": "authorized_keys",
        "longname": "-rw-------    1 root     root            0 Mar  4 03:04 authorized_keys",
        "attrs": {
          "mode": 33152,
          "permissions": 33152,
          "uid": 0,
          "gid": 0,
          "size": 0,
          "atime": 1614827098,
          "mtime": 1614827044
        }
      }
    ]
  },
  {
    "filename": ".viminfo",
    "longname": "-rw-------    1 root     root          705 Mar  4 03:26 .viminfo",
    "attrs": {
      "mode": 33152,
      "permissions": 33152,
      "uid": 0,
      "gid": 0,
      "size": 705,
      "atime": 1614832649,
      "mtime": 1614828404
    }
  },
  {
    "filename": "nested",
    "longname": "drwxr-xr-x    3 root     root         4096 Mar  4 05:20 nested",
    "attrs": {
      "mode": 16877,
      "permissions": 16877,
      "uid": 0,
      "gid": 0,
      "size": 4096,
      "atime": 1614835559,
      "mtime": 1614835223
    },
    "children": [
      {
        "filename": "1.txt",
        "longname": "-rw-r--r--    1 root     root            2 Mar  4 04:39 1.txt",
        "attrs": {
          "mode": 33188,
          "permissions": 33188,
          "uid": 0,
          "gid": 0,
          "size": 2,
          "atime": 1614832798,
          "mtime": 1614832798
        }
      },
      {
        "filename": "nested2",
        "longname": "drwxr-xr-x    2 root     root         4096 Mar  4 04:39 nested2",
        "attrs": {
          "mode": 16877,
          "permissions": 16877,
          "uid": 0,
          "gid": 0,
          "size": 4096,
          "atime": 1614832808,
          "mtime": 1614832788
        },
        "children": []
      }
    ]
  },
  {
    "filename": "snap",
    "longname": "drwxr-xr-x    3 root     root         4096 Mar  4 03:04 snap",
    "attrs": {
      "mode": 16877,
      "permissions": 16877,
      "uid": 0,
      "gid": 0,
      "size": 4096,
      "atime": 1614832559,
      "mtime": 1614827085
    },
    "children": [
      {
        "filename": "lxd",
        "longname": "drwxr-xr-x    4 root     root         4096 Mar  4 03:04 lxd",
        "attrs": {
          "mode": 16877,
          "permissions": 16877,
          "uid": 0,
          "gid": 0,
          "size": 4096,
          "atime": 1614832559,
          "mtime": 1614827085
        },
        "children": [
          {
            "filename": "common",
            "longname": "drwxr-xr-x    2 root     root         4096 Mar  4 03:04 common",
            "attrs": {
              "mode": 16877,
              "permissions": 16877,
              "uid": 0,
              "gid": 0,
              "size": 4096,
              "atime": 1614832560,
              "mtime": 1614827085
            },
            "children": []
          },
          {
            "filename": "16922",
            "longname": "drwxr-xr-x    2 root     root         4096 Mar  4 03:04 16922",
            "attrs": {
              "mode": 16877,
              "permissions": 16877,
              "uid": 0,
              "gid": 0,
              "size": 4096,
              "atime": 1614832560,
              "mtime": 1614827085
            },
            "children": []
          },
          {
            "filename": "current",
            "longname": "lrwxrwxrwx    1 root     root            5 Mar  4 03:04 current",
            "attrs": {
              "mode": 41471,
              "permissions": 41471,
              "uid": 0,
              "gid": 0,
              "size": 5,
              "atime": 1614827087,
              "mtime": 1614827085
            }
          }
        ]
      }
    ]
  },
  {
    "filename": ".cache",
    "longname": "drwx------    2 root     root         4096 Mar  4 03:24 .cache",
    "attrs": {
      "mode": 16832,
      "permissions": 16832,
      "uid": 0,
      "gid": 0,
      "size": 4096,
      "atime": 1614832560,
      "mtime": 1614828253
    },
    "children": [
      {
        "filename": "motd.legal-displayed",
        "longname": "-rw-r--r--    1 root     root            0 Mar  4 03:24 motd.legal-displayed",
        "attrs": {
          "mode": 33188,
          "permissions": 33188,
          "uid": 0,
          "gid": 0,
          "size": 0,
          "atime": 1614828253,
          "mtime": 1614828253
        }
      }
    ]
  },
  {
    "filename": ".bash_history",
    "longname": "-rw-------    1 root     root          480 Mar  4 06:22 .bash_history",
    "attrs": {
      "mode": 33152,
      "permissions": 33152,
      "uid": 0,
      "gid": 0,
      "size": 480,
      "atime": 1614838976,
      "mtime": 1614838957
    }
  }
]
```
