import plotly.express as px
import plotly.utils
import json
import numpy as np
from pathlib import Path


OUTPUT_FILENAME = 'logistic_loss_graph.json'


def save_plotly_json(
	fig,
	output_filename: str,
	workspace_root: Path | None = None,
) -> Path:
	graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

	root = workspace_root or Path(__file__).resolve().parents[3]
	output_dir = root / 'ml-visualized-web' / 'public' / 'data'
	output_dir.mkdir(parents=True, exist_ok=True)

	output_file = output_dir / output_filename
	output_file.write_text(graph_json, encoding='utf-8')

	return output_file


def generate_logistic_loss_graph(
	output_filename: str = OUTPUT_FILENAME,
	workspace_root: Path | None = None,
) -> Path:
	z = np.linspace(-5, 5, 100)
	loss = np.log(1 + np.exp(-z))

	fig = px.line(x=z, y=loss, title='Logistic Loss vs Margin (z)')
	return save_plotly_json(fig, output_filename, workspace_root=workspace_root)


if __name__ == '__main__':
	output_file = generate_logistic_loss_graph()
	print(f'Saved: {output_file}')