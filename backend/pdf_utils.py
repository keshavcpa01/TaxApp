from weasyprint import HTML
from jinja2 import Template
from typing import List

def generate_1099_pdf(form_data_list: List[dict], output_path: str):
    template_str = """
    <h1>1099-NEC Submission Confirmation</h1>
    {% for form in forms %}
      <hr>
      <h3>Payer: {{ form.payer_name }} ({{ form.payer_tin }})</h3>
      <p>Recipient: {{ form.recipient_name }} ({{ form.recipient_tin }})</p>
      <p>Compensation: ${{ '%.2f'|format(form.nonemployee_compensation|float) }}</p>
      <p>Federal Withholding: ${{ '%.2f'|format(form.federal_income_tax_withheld|float) }}</p>
      <p>State: {{ form.state }} ({{ form.state_id }}) — State Income: ${{ '%.2f'|format(form.state_income|float) }}</p>
    {% endfor %}
    """
    html = Template(template_str).render(forms=form_data_list)
    HTML(string=html).write_pdf(output_path)
