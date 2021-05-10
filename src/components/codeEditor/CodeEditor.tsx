import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'
import { useRef } from 'react'
import Prettier from 'prettier'
import parser from 'prettier/parser-babel'
import { StyledCodeEditorWrap, StyledButtonWrap } from './style'
interface CodeEditorProps {
	initialValue: string
	onChange(value: string): void
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
	initialValue,
	onChange,
}) => {
	const editorRef = useRef<any>()

	const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
		editorRef.current = monacoEditor
		monacoEditor.onDidChangeModelContent(() => {
			onChange(getValue())
		})
	}
	const onFormatClick = () => {
		const unformatted = editorRef.current.getModel().getValue()
		const formatted = Prettier.format(unformatted, {
			parser: 'babel',
			plugins: [parser],
			useTabs: true,
			semi: false,
			singleQuote: true,
		})
		editorRef.current.setValue(formatted)
	}

	return (
		<StyledCodeEditorWrap>
			<StyledButtonWrap>
				<button
					className="button button-format is-primary is-small"
					onClick={onFormatClick}
					style={{ position: 'absolute' }}
				>
					Format
				</button>
			</StyledButtonWrap>
			<MonacoEditor
				value={initialValue}
				height="30vh"
				theme="vs-dark"
				language="javascript"
				editorDidMount={onEditorDidMount}
				options={{
					wordWrap: 'on',
					minimap: {
						enabled: false,
					},
					showUnused: false,
					folding: false,
					lineNumbersMinChars: 3,
					fontSize: 16,
					scrollBeyondLastLine: false,
					automaticLayout: true,
					tabCompletion: 'on',
				}}
			/>
		</StyledCodeEditorWrap>
	)
}
