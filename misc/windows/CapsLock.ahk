#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

; Deactivates capslock for normal (accidental) use.
#Persistent
SetCapsLockState, AlwaysOff

; Capslock + hjkl (left, down, up, right)
Capslock & h::Send {Blind}{Left DownTemp}
Capslock & h up::Send {Blind}{Left Up}
Capslock & j::Send {Blind}{Down DownTemp}
Capslock & j up::Send {Blind}{Down Up}
Capslock & k::Send {Blind}{Up DownTemp}
Capslock & k up::Send {Blind}{Up Up}
Capslock & l::Send {Blind}{Right DownTemp}
Capslock & l up::Send {Blind}{Right Up}

; Capslock only (send escape)
CapsLock::Send, {ESC}

; Capslock + space (toggle always on top)
Capslock & Space:: Winset, Alwaysontop, , A

; Caplock + Esc (exit script)
Capslock & Esc::
	MsgBox Exiting Autohotkey
	ExitApp
Return

