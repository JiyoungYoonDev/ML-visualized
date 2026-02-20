import numpy as np
import plotly.graph_objects as go
from logistic_loss_graph import save_plotly_json


OUTPUT_FILENAME = 'loss_funcs_compare.json'

z = np.linspace(-3, 3, 400)

logistic_loss = np.log(1 + np.exp(-z))

hinge_loss = np.maximum(0, 1 - z)

exponential_loss = np.exp(-z)

fig = go.Figure()

fig.add_trace(go.Scatter(
    x=z, y=logistic_loss,
    mode='lines',
    name='Logistic Loss (Log-Loss)',
    line=dict(color='#2563eb', width=4)
))

fig.add_trace(go.Scatter(
    x=z, y=hinge_loss,
    mode='lines',
    name='Hinge Loss (SVM)',
    line=dict(color='#16a34a', width=3, dash='dot')
))

fig.add_trace(go.Scatter(
    x=z, y=exponential_loss,
    mode='lines',
    name='Exponential Loss (AdaBoost)',
    line=dict(color='#dc2626', width=2, dash='dash')
))

fig.update_layout(
    title={
        'text': "<b>Loss Functions vs. Margin (z)</b>",
        'y':0.95, 'x':0.5, 'xanchor': 'center', 'yanchor': 'top'
    },
    xaxis_title="Margin (z = y * f(x))",
    yaxis_title="Loss Value",
    template="plotly_white",
    hovermode="x unified",
    yaxis=dict(range=[0, 5]),
    legend=dict(yanchor="top", y=0.99, xanchor="right", x=0.99)
)

fig.add_vline(x=0, line_dash="dash", line_color="gray", opacity=0.5, annotation_text="Boundary")
fig.add_vline(x=1, line_dash="dot", line_color="green", opacity=0.3)

output_file = save_plotly_json(fig, OUTPUT_FILENAME)
print(f'Saved: {output_file}')
