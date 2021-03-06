/*
 * Menu: Editors > run Vim
 * Kudos: ZoAmichi
 * License: EPL 1.0
 * Key: Ctrl+;
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 */

/**
 * VimLauncherのプロトタイプ
 * test
 */
var VimLauncher=function(){};
VimLauncher.prototype={
	/** TODO ここにVIMのパスを入れる */
	VIM_PATH: "D:/Applications/vim/gvim.exe",
	/** VIMに渡すオプション */
	VIM_OPTION: "--remote-tab-silent",
	/** 指定TargetFileを編集 */
	edit: function(targetFile){
		var opt = this.VIM_OPTION;
		if(targetFile.currentLineNumber!=null){
			opt += ' +'+targetFile.currentLineNumber;//行指定
		}
		this.execNoWait(
			this.VIM_PATH+' '+
			opt+' "'+targetFile.filepath+'"');
	},
	execNoWait: function(command){
		Packages.java.lang.Runtime.getRuntime().exec(command);
	}
};

/**
 * TargetFileのプロトタイプ
 */
var TargetFile=function(){};
TargetFile.prototype={
	filepath: "",
	extension: "",
	currentLineNumber:null
};

/**
 * 指定のIWorkbenchPageから編集すべきTargetFileを生成します
 * @param view
 * @return 編集すべきTargetFileを返します
 */
function getTargetFileFromView(page){
	// アクティブなIViewPartを取得する方法がわかりませんでした。
	// 知ってる方いたら教えてください。
	
	// 仕方ないのでDOMを使ってアクティブなエディタを取得
	var targetFile = new TargetFile(); 
	var editor = editors.activeEditor;
	var selectionRange = editor.selectionRange;
	targetFile.currentLineNumber = editor.getLineAtOffset(selectionRange.startingOffset) + 1;
	var editorInput = page.getActiveEditor().getEditorInput();
	targetFile.filepath = editorInput.getFile().getLocation().toOSString();
	return targetFile;
}

function message(title, text){
	Packages.org.eclipse.jface.dialogs
		.MessageDialog.openInformation(window.getShell(), title, text)
}

function main(){
	// 編集すべきファイルを取得
	var targetFile = getTargetFileFromView(window.getActivePage());
	var vimLauncher = new VimLauncher();
	// Vimの起動
	vimLauncher.edit(targetFile);
}
