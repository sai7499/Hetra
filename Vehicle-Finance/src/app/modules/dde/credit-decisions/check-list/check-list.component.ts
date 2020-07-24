import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})
export class CheckListComponent implements OnInit {

  constructor() {
    // tslint:disable-next-line: deprecation
    // $(document).click(() => {

    //     $('#d_date').prop('disabled', true);
    //     $('#deferral_status').change(function() {
    //     let type_vals =  $('#deferral_status').val();
    //     if (type_vals == 'Deferred') {
    //             $('#d_date').prop('disabled', false);
    //         } else {
    //             $('#d_date').prop('disabled', true);
    //          }

    //     });

    // });
    $(document).ready(function() {
      $('.collapse')
          .on('shown.bs.collapse', function(event) {
              event.stopPropagation();
              console.log("open");
              $(this)
                  .parent()
                  .find(".fa-chevron-right")
                  .removeClass("fa-chevron-right")
                  .addClass("fa-chevron-down")
                  .find(".btn_bar")
                  .removeClass("btn_bar")
                  .addClass("btn_bar_pink");
  
          }).on('hidden.bs.collapse', function(event) {
              console.log("closed");
              event.stopPropagation();
              $(this)
                  .parent()
                  .find(".fa-chevron-down")
                  .removeClass("fa-chevron-down")
                  .addClass("fa-chevron-right")
                  .find(".btn_bar_pink")
                  .removeClass("btn_bar_pink")
                  .addClass("btn_bar");
  
          });
  });
    // var hdr_locations_ids = new Array('#credit_sourcing_details','#credit_application_details','#credit_vehicle_details','#credit_fleet_details','#credit_liveloan','#credit_income_details','#credit_psl_data','#credit_vehicle_valuation','#credit_tvr_details','#credit_fi_pd','#credit_vehicle_viability','#credit_existing_relationship','#credit_score_card','#credit_cam','#credit_deviations','#credit_insurance','#credit_conditions','#credit_term_sheets','#credit_sanction_details','#credit_checklist');
    // var length_hdr_locations_ids = hdr_locations_ids.length;
    // $('button').click(function() {
    //     var get_button_id_here = $(this).attr('id');
    //     var actual_id_get = '#' + get_button_id_here;
    //     for (m = 0; m < length_hdr_locations_ids; m++) {
    //         if (hdr_locations_ids[m] == actual_id_get) {
    //             var get_html_file_name_here = actual_id_get.split('#');
    //             var actual_file_name = get_html_file_name_here[1] + '.html';
    //             var path = actual_file_name;
    //             document.location = path;
    //         } else {

    //         }

        // }
    // });

  }

  ngOnInit() {
  }
  // onClick(event: any) {
  //   const element = event.target;
  //   console.log(element);
  //   element.classList.toggle('active');
  //   console.log(element.style);
  //   // const panel = element.nextElementSibling;
  //   if (element.style.display === 'block') {
  //     element.style.display = 'none';
  //   } else if (element.style == null) {
  //     element.style.display = 'none';
  //   } else {
  //     element.style.display = 'block';
  //   }
  // }

}
